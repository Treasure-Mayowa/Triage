import OpenAI from "openai"
import VoiceResponse from "twilio/lib/twiml/VoiceResponse"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { dataUpdate } from "../socket/server"

// Initialize OpenAI API client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY,
})

// Function to make API call to OpenAI
const getResponse = async (message, CALLTRANSCRIPT) => {
  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-exp:free',
    models: ['google/gemini-2.0-flash-thinking-exp:free', 'deepseek/deepseek-r1-zero:free'],
    messages: [
      {
        "role": "system",
        "content": `${process.env.PROMPT}. Call history: ${CALLTRANSCRIPT}`
      },
      {
        "role": "user",
        "content": `Caller: ${message}`
      }
    ],
  })
  const response = completion.choices[0].message.content.replace("Operator:", "")
  return response
}

//Extract key details from call
const summariseCall = async (transcript) => {
  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-exp:free',
    models: ['google/gemini-2.0-flash-thinking-exp:free', 'deepseek/deepseek-r1-zero:free'],
    messages: [
      {
        "role": "system",
        "content": process.env.SUMMARY_PROMPT
      },
      {
        "role": "user",
        "content": `Call transcript: ${transcript}`
      }
    ],
  })
  let response = completion.choices[0].message.content
  response = response.replace(/```json\s*|\s*```/g, "").trim()
  const data = JSON.parse(response)
  return data
}


export async function POST(req, res) {  
    const formData = await req.formData()
    const body = Object.fromEntries(formData.entries())
    const { SpeechResult: message, CallSid: callSid } = body

    // Construct the absolute URL for the /api/emergencies endpoint
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http"
    const emergenciesUrl = `${protocol}://${host}/api/emergencies`

    const { database } = await connectToDatabase()
    const collection = database.collection("emergencies")
    let emergency = await collection.findOne({ callSid: callSid })
    if (!emergency) {
      const response = await fetch(emergenciesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: req.body.From || "Unknown",
          location: `${req.body.FromCity}, ${req.body.FromState}, ${req.body.FromCountry}, ${req.body.FromZip}`,
          callSid: callSid, 
          source: 'AI-Automated Call',
          transcript: "Operator: Triageflow, what's your emergency?\n",
          count: 0
        })
      })
      const data = await response.json()
      emergency = await collection.findOne({ callSid: callSid })
    }   
    const twiml = new VoiceResponse()
    let aiResponse = ""
    let count = emergency.count
    let CALLTRANSCRIPT = emergency.transcript
    
    if (count < 5) {
      try {
        aiResponse = await getResponse(message, CALLTRANSCRIPT)
      } catch (error) {
        console.log(error.message)
        aiResponse = "I'm sorry, I didn't understand what you said. Could you repeat that?"
      }
      const gather = twiml.gather({
        timeout: 10,
        input: "speech",
        method: "POST",
        action: "/api/respond-call"
      })
      gather.say(
          { voice: 'alice' }, 
          aiResponse)
        count+=1
    } else {
      aiResponse = "Thank you for calling in. I will now process help to your location. Goodbye and stay safe."
      twiml.say(
        { voice: 'alice' },
        aiResponse)
      twiml.hangup()
      CALLTRANSCRIPT += `Caller: ${message}\nOperator: ${aiResponse}`
      const summary = await summariseCall(CALLTRANSCRIPT)
      const result = await collection.updateOne({ _id: emergency._id }, 
        { $set: { transcript: CALLTRANSCRIPT,
          count: count,
          title: summary.title || 'Unknown',
          description: summary.description || 'Unknown',
          location: summary.location,
          name: summary.location,
          priority: summary.priority  
        } })     
      const updatedData = await dataUpdate()
      return new NextResponse(twiml.toString(), {
        headers: { "Content-Type": "text/xml" },
      }) 
    }
    CALLTRANSCRIPT += `Caller: ${message}\nOperator: ${aiResponse}`
    const result = await collection.updateOne({ _id: emergency._id }, { $set: { transcript: CALLTRANSCRIPT, count: count } })     
    const updatedData = await dataUpdate()
    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" },
    })                                       
}
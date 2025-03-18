import OpenAI from "openai"
import VoiceResponse from "twilio/lib/twiml/VoiceResponse"
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Initialize call trancript
let CALLTRANSCRIPT = "Operator: Triageflow, what's your emergency?\n"
let count = 0

// Initialize OpenAI API client
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.API_KEY,
})

// Function to make API call to OpenAI
const getResponse = async (message) => {
  const completion = await openai.chat.completions.create({
    model: 'google/gemini-2.0-flash-exp:free',
    models: ['google/gemini-2.0-flash-thinking-exp:free', 'deepseek/deepseek-r1-zero:free'],
    messages: [
      {
        "role": "system",
        "content": process.env.PROMPT
      },
      {
        "role": "assistant",
        "content": `Message history: ${CALLTRANSCRIPT}`
      },
      {
        "role": "user",
        "content": `Caller: ${message}`
      }
    ],
  })
  return completion.data.choices[0].message.content
}

export async function POST(req, res) {  
    const message = req.body.SpeechResult
    const callSid = req.body.CallSid


    // Construct the absolute URL for the /api/emergencies endpoint
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http"
    const emergenciesUrl = `${protocol}://${host}/api/emergencies`
    const twiml = new VoiceResponse()
    if (count < 4) {
      let aiResponse
      try {
        aiResponse = await getResponse(message)
      } catch (error) {
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
      twiml.say(
        { voice: 'alice' },
        "Thank you for calling in. I will now process help to your location. Goodbye and stay safe.")
      twiml.hangup()
    }
    CALLTRANSCRIPT += `Caller: ${message}\nOperator: ${aiResponse}`
    const { database } = await connectToDatabase()
    const collection = database.collection("emergencies")
    const emergency = await collection.findOne({ callSid: callSid })
    if (emergency) {
      const result = await collection.updateOne({ id: emergency._id }, { $set: { transcript: CALLTRANSCRIPT } })
    } else {
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
            transcript: CALLTRANSCRIPT
        })
      })
      const data = await response.json()
      console.log(data)
    }        
    console.log(CALLTRANSCRIPT)
    return NextResponse.json(twiml.toString())                                     
}
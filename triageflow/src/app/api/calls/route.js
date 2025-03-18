import twilio from "twilio"
import VoiceResponse from "twilio/lib/twiml/VoiceResponse"
import { NextResponse } from "next/server"

const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSID, authToken)


export async function POST(req, res) {
    const formData = await req.formData()
    const callerNumber = formData.get("From")
    const city = formData.get("FromCity")
    const state = formData.get("FromState")
    const country = formData.get("FromCountry")
    const zip = formData.get("FromZip")
    const callSid = formData.get("CallSid")

    // Construct the absolute URL for the /api/emergencies endpoint
    const host = req.headers.get("host")
    const protocol = req.headers.get("x-forwarded-proto") || "http"
    const emergenciesUrl = `${protocol}://${host}/api/emergencies`
    const respondCallUrl = `${protocol}://${host}/api/respond-call`

    var twiml = new VoiceResponse()
    const gather = twiml.gather({
        timeout: 10,
        input: "speech",
        method: "POST",
        action: respondCallUrl
    })
    gather.say(
        { voice: 'alice' }, 
        "Triageflow, what's your emergency?")
    const response = await fetch(emergenciesUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phoneNumber: callerNumber,
            location: `${city}, ${state}, ${country}, ${zip}`,
            callSid: callSid, 
            source: 'AI-Automated Call'
        })
    })
    const data = await response.json()
    console.log(data)
    return NextResponse.json(twiml.toString())
}
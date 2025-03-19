// For updating emergencies onf dashboard and stats
import { connectToDatabase } from "@/lib/mongodb"
import { NextResponse } from "next/server"
import validator from "validator"
import { dataUpdate } from "../socket/server"


export async function GET(req, res) {
    try {
        const { database } = await connectToDatabase()
        const collection = database.collection("emergencies")
        const emergencies = await collection.find().toArray()
        return NextResponse.json(emergencies)
    } catch (err) {
        return NextResponse.json(err.message, { status: 500 })
    }
}

// Fix this for new emergency add
export async function POST(req) {
    try {
        const { phoneNumber, location = '', callSid, title = '', description = '', priority = '', status = 'Active', source, transcript, assignedTo = '' } = await req.json()
        
        if (!phoneNumber || !callSid) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const { database } = await connectToDatabase()
        const collection = database.collection("emergencies")

        const newEmergency = {
            callSid,
            title: validator.escape(title),
            description: validator.escape(description),
            phoneNumber,
            location,
            priority,
            status: status,
            transcript: transcript || '',
            assignedTo,
            timestamp: new Date().toISOString(),
            source
        }

        const result = await collection.insertOne(newEmergency)
        const updatedData = await dataUpdate()
        return NextResponse.json(result)
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

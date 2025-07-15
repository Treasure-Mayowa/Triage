const express = require('express')
const { Server } = require('socket.io')
require('dotenv').config()
const http = require('http')
const cors = require('cors')
const { connectToDatabase } = require('./lib/mongodb-setup')
const twilio = require('twilio')
const VoiceResponse = twilio.twiml.VoiceResponse
const validator = require('validator')
const callsRouter = require('./routes/respond-call')
const { dataUpdate } = require('./utils/dataUpdate')

const app = express()
const server = http.createServer(app)
const hostName = process.env.HOSTNAME
const port = process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Set up Twilio environment keys
const accountSID = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = twilio(accountSID, authToken)


const corsOptions = {
    origin: ['https://triageflow.vercel.app/', 'http://localhost:3000', '*'],
    methods: ['GET', 'POST', 'DELETE'],
    optionsSuccessStatus: 200
}

// New socket server
const io = new Server(server, {
    cors: corsOptions
})
// Setting io instance
app.set('io', io)

io.on("connection", (socket) => {
    
  console.log(`socket ${socket.id} connected`)
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })

})

server.listen(port, hostName, () => {
    console.log(`Server running at http://${hostName}:${port}/`)    
})


app.get('/socket-emergency', async (req, res) => {
  try {
      const response = await dataUpdate(req.app.get('io'))
      response.error? res.status(500).json({ error: response.error}) : res.json({ message: "Success!" })
    } catch (error) {
      console.error('Error broadcasting emergencies:', error)
      res.status(500).json({ error: error.message })
    }
})

// Triageflow API routes
app.post('/api/calls', async (req, res) => {
  const body = req.body
  const { From: callerNumber = null, FromCity: city = null, FromState: state = null, FromCountry: country = null, FromZip: zip = null, CallSid: callSid = null } = body
  const location = `${city}, ${state}, ${country}, ${zip}`

  // Construct the absolute URL for the /api/emergencies endpoint
  const host = req.headers.host
  const protocol = req.headers["x-forwarded-proto"] || "http"
  const emergenciesUrl = `${protocol}://${host}/api/emergencies`
  const respondCallUrl = `${protocol}://${host}/api/respond-call`

  const twiml = new VoiceResponse()
  const gather = twiml.gather({
      timeout: 10,
      speechTimeout: 'auto',
      speechModel: 'experimental_conversations', 
      input: "speech",
      method: "POST",
      action: respondCallUrl
  })
  gather.say(
      { voice: 'alice' }, 
      "Triageflow, what's your emergency?")
  if (callerNumber && callSid) {
      const response = await fetch(emergenciesUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              phoneNumber: callerNumber,
              location: location || 'None',
              callSid: callSid, 
              source: 'AI-Automated Call'
          })
      })
      const data = await response.json()
      console.log(data)
  } 
  res.type('text/xml')
  res.send(twiml.toString())
})

app.get('/api/emergencies', async (req, res)=> {
  try {
      const { database } = await connectToDatabase()
      const collection = database.collection("emergencies")
      const emergencies = await collection.find().toArray()
      res.type('json')
      res.send(JSON.stringify(emergencies))
    } catch (err) {
      res.type('json')
      res.status(500).json({error: err.message })
    }
})

app.post('/api/emergencies', async (req, res) => {
  try {
        const { phoneNumber, location, callSid, title = 'Unknown', description = 'Unknown', priority = '', status = 'Active', source, transcript = '', assignedTo = '', count = 0 } = await req.body
        
        if (!phoneNumber || !callSid) {
          res.status(400).json({ error: "Missing required fields" })
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
            transcript: transcript,
            assignedTo,
            timestamp: new Date().toISOString(),
            source,
            count
        }

        const result = await collection.insertOne(newEmergency)
        const updatedData = await dataUpdate(req.app.get('io'))
        res.json({ message: "Emergency added successfully"})
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
})

app.post('/api/respond-call', callsRouter)
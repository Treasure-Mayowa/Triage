const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const cors = require('cors')
const { connectToDatabase } = require('./lib/mongodb-setup')

const app = express()
const server = http.createServer(app)
const hostName = '127.0.0.1'
const port = 3000


const corsOptions = {
    origin: '*',
    methods: 'GET',
    optionsSuccessStatus: 200
}

// New socket server
const io = new Server(server, {
    cors: corsOptions
})

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
      const { database } = await connectToDatabase()
      const emergencies = await database.collection('emergencies').find().toArray()
  
      // Emit the event to all connected clients
      io.emit('emergency-updated', emergencies)
      res.json({ status: 'Broadcast sent', emergencies })
    } catch (error) {
      console.error('Error broadcasting emergencies:', error)
      res.status(500).json({ error: error.message })
    }
})

const request = require('supertest')
const { app } = require('../server')
const { connectToDatabase } = require('../lib/mongodb-setup')



describe('Emergency API Endpoints', () => {
  let db
  let server
  
  jest.setTimeout(10000)

  beforeAll(async () => {
    try {
        const conn = await connectToDatabase()
        db = conn.database
        server = app.listen(0)
        console.log('Test DB connected')
    } catch (error) {
        console.error('DB Connection error:', error)
    }
  })

  describe('GET /api/emergencies', () => {
    it('should return all emergencies', async () => {
      const res = await request(app)
        .get('/api/emergencies')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(Array.isArray(res.body)).toBeTruthy()
    })
  })

  describe('POST /api/emergencies', () => {
    it('should create new emergency for dashboard add', async () => {
      const emergency = {
        phoneNumber: '1234567890',
        title: 'Test Emergency',
        description: 'Test Description',
        location: 'Test Location',
        source: 'Dashboard Add'
      }

      const res = await request(app)
        .post('/api/emergencies')
        .send(emergency)
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.message).toBe('Emergency added successfully')
    })

    it('should require phoneNumber for dashboard add', async () => {
      const emergency = {
        title: 'Test Emergency',
        source: 'Dashboard Add'
      }

      const res = await request(app)
        .post('/api/emergencies')
        .send(emergency)
        .expect(400)

      expect(res.body.error).toBe('Phone number is required')
    })
    it('should require callSid for AI-Automated call', async () => {
        const emergency = {
        phoneNumber: '1234567890',
        title: 'Test Emergency',
        description: 'Test Description',
        location: 'Test Location',
        source: 'AI-Automated Call'
      }

      const res = await request(app)
        .post('/api/emergencies')
        .send(emergency)
        .expect(400)

      expect(res.body.error).toBe('Missing required fields for automated call')

    })
  })

  describe('PUT /api/emergencies/:id', () => {
    it('should update emergency status', async () => {
      // First create an emergency
      const collection = db.collection('emergencies')
      const emergency = await collection.insertOne({
        phoneNumber: '1234567890',
        source: 'Dashboard Add',
        status: 'Active'
      })

      const res = await request(app)
        .put(`/api/emergencies/${emergency.insertedId}`)
        .send({ status: 'In Progress' })
        .expect(200)

      expect(res.body.message).toBe('Emergency updated successfully')
    })

    it('should validate status value', async () => {
      const res = await request(app)
        .put('/api/emergencies/507f1f77bcf86cd799439011')
        .send({ status: 'Invalid' })
        .expect(400)

      expect(res.body.error).toBe('Invalid status value')
    })
  })
  afterAll(async () => {
    await server.close()
    await db.client.close()
  })
})
const { MongoClient, ServerApiVersion } = require("mongodb")
require('dotenv').config()
const url = process.env.MONGODB_URI
const dbName = process.env.DATABASE_NAME

if (!url) {
    throw new Error("MONGODB_URI is not defined in environment variables.")
}

let client
let database

async function connectToDatabase() {
    if (database) return { database }

    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    client = new MongoClient(url, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    })

    await client.connect()
    await client.db("admin").command({ ping: 1 })
    console.log("Connected to MongoDB!")

    database = client.db(dbName)
    return { database }
}

module.exports = { connectToDatabase }
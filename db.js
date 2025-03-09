const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("blogDB"); // Change "blogDB" to your database name
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

module.exports = connectDB;
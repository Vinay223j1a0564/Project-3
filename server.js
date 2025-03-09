const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();
const app = express();
app.use(express.json()); // Middleware to parse JSON requests

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then(client => {
        db = client.db('blogDatabase');
        console.log('Connected to MongoDB');
    })
    .catch(err => console.error('MongoDB connection error:', err));

// ---------------- API Endpoints ---------------- //

// Create a Blog Post (POST)
app.post('/posts', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = await db.collection('posts').insertOne({ title, content, createdAt: new Date() });
        res.status(201).json({ message: 'Blog post created', postId: newPost.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Get All Blog Posts (GET)
app.get('/posts', async (req, res) => {
    try {
        const posts = await db.collection('posts').find().toArray();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get Single Blog Post by ID (GET)
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await db.collection('posts').findOne({ _id: new ObjectId(req.params.id) });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Update a Blog Post (PUT)
app.put('/posts/:id', async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedPost = await db.collection('posts').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { title, content, updatedAt: new Date() } }
        );

        if (updatedPost.matchedCount === 0) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json({ message: 'Blog post updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Delete a Blog Post (DELETE)
app.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await db.collection('posts').deleteOne({ _id: new ObjectId(req.params.id) });
        if (deletedPost.deletedCount === 0) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json({ message: 'Blog post deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(Server is running on http://localhost:${PORT});
});
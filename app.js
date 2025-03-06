const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from Vue.js

// MongoDB Atlas Connection URI
const uri = "mongodb+srv://user2000:test123@bookstore.vcmdi.mongodb.net/bookstore?retryWrites=true&w=majority&appName=BookStore";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

// Connect to MongoDB
client.connect()
    .then(() => {
        db = client.db("bookstore");
        console.log("Connected to MongoDB");
        app.listen(3000, () => console.log("Server running on port 3000"));
    })
    .catch(err => console.error("Database connection failed:", err));

// Get all books (paginated)
app.get('/books', async (req, res) => {
    try {
        const page = parseInt(req.query.p) || 0;
        const booksPerPage = 3;

        const books = await db.collection('books')
            .find()
            .sort({ author: 1 })
            .skip(page * booksPerPage)
            .limit(booksPerPage)
            .toArray();

        res.status(200).json(books);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch books', details: err.message });
    }
});

// Get a book by ID
app.get('/books/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid book ID' });

    try {
        const book = await db.collection('books').findOne({ _id: new ObjectId(id) });
        if (!book) return res.status(404).json({ error: 'Book not found' });
        res.status(200).json(book);
    } catch (err) {
        res.status(500).json({ error: 'Could not fetch the book', details: err.message });
    }
});

// Add a new book
app.post('/books', async (req, res) => {
    const book = req.body;
    if (!book.title || !book.author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }

    try {
        const result = await db.collection('books').insertOne(book);
        res.status(201).json({ message: 'Book added', bookId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: 'Could not add book', details: err.message });
    }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid book ID' });

    try {
        const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Book not found' });

        res.status(200).json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ error: 'Could not delete book', details: err.message });
    }
});

// Update a book
app.patch('/books/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid book ID' });
    if (!updates.title || !updates.author) {
        return res.status(400).json({ error: 'Title and author are required' });
    }

    try {
        const result = await db.collection('books')
            .updateOne({ _id: new ObjectId(id) }, { $set: updates });

        if (result.matchedCount === 0) return res.status(404).json({ error: 'Book not found' });

        res.status(200).json({ message: 'Book updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Could not update book', details: err.message });
    }
});

const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');
const cors = require('cors');

// init app & middleware
const app = express();
app.use(express.json());
// Enable CORS for all origins (you can restrict this for specific origins later)
app.use(cors());

// db connection
let db;

connectToDb((err) => {
    if (!err) {
        app.listen(3000, () => {
            console.log('app listening on port 3000');
        });
        db = getDb();  // Call getDb() here to retrieve the actual database instance
    }
    else {
        console.log("Failed to connect to database");
    }
});

// routes
app.get('/books', (req, res) => {
    let books = [];
    let page = parseInt(req.query.p) || 0;  // Parse query string value
    const booksPerPage = 3;

    db.collection('books')
        .find()
        .sort({ author: 1 })
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books);
        })
        .catch((err) => {
            res.status(500).json({ error: 'Could not fetch the documents' });
        });
});

app.post('/books', (req, res) => {
    const book = req.body;

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: 'Could not create the documents' });
        });
});


app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .deleteOne({ _id: new ObjectId(req.params.id) })
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json({ error: 'Could not delete the document' });
            });
    } else {
        res.status(500).json({ error: 'Not a valid document' });
    }
});

// Fetch specific book by ID
app.get('/books/:id', (req, res) => {
    const { id } = req.params;
    if (ObjectId.isValid(id)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(id) })
            .then(doc => {
                res.status(200).json(doc);
            })
            .catch(err => {
                res.status(500).json({ error: 'Could not fetch the document' });
            });
    } else {
        res.status(400).json({ error: 'Invalid book ID' });
    }
});

// Update book details
// Update book details
app.patch('/books/:id', (req, res) => {
    const updates = req.body;

    // Ensure title and author are provided
    if (!updates.title || !updates.author) {
        return res.status(400).json({ error: 'Title and author are required fields' });
    }

    // Remove the _id field from the updates object
    delete updates._id;

    // Check if the ID is valid
    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
            .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates })
            .then(result => {
                if (result.matchedCount === 0) {
                    return res.status(404).json({ error: 'Book not found' });
                }
                res.status(200).json({ message: 'Book updated successfully' });
            })
            .catch(err => {
                console.error('Error details:', err);  // Log error details
                res.status(500).json({ error: 'Could not update the document', details: err.message });
            });
    } else {
        res.status(400).json({ error: 'Invalid book ID' });
    }
});


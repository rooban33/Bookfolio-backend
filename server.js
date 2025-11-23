const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure required directories exist
const uploadsDir = path.join(__dirname, 'uploads', 'books');
const dataDir = path.join(__dirname, 'data');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize books.json if it doesn't exist
const booksFilePath = path.join(dataDir, 'books.json');
if (!fs.existsSync(booksFilePath)) {
  const initialBooks = [
    {
      "id": 1,
      "name": "The Silent Patient",
      "author": "Alex Michaelides",
      "category": "Thriller",
      "date": "2025-08-24",
      "image": "",
      "notes": "This is the book that got me into reading thriller books. This will be the best thriller ever. Don't want to spoil the story. I borrowed this from Pranav after completing the Artemis fowl without any idea."
    },
    {
      "id": 2,
      "name": "Artemis Fowl 1",
      "author": "Eoin Colfer",
      "category": "Fiction",
      "date": "2025-08-10",
      "image": "",
      "notes": "Wanted to read this book series from class 10 after seeing this book with Abinav. It's a good book even though it is meant for kids. Introduction of the butler was sooo good and his fight with the troll was absolute cinema. After reading the book I wanted to complete the series."
    },
    {
      "id": 3,
      "name": "Anilaadum Mundril",
      "author": "Na Muthukumar",
      "category": "Simple",
      "date": "2025-01-10",
      "image": "",
      "notes": "It’s a Tamil book I started reading for distraction during placements. It really did the job by distracting me and taking me back to my childhood days. The book contains letters the writer intended to write to each of his relatives. I didn’t read all of them — only the ones I felt connected to. The letters to the mother, father, sister, and Periyappa were wonderful. I may reread them again!"
    },
    {
      "id": 4,
      "name": "The Alchemist",
      "author": "Paulo Coelho",
      "category": "Simple",
      "date": "2024-04-05",
      "image": "",
      "notes": "A simple story about following your dreams. Sowshi's book and I randomly started reading the book. Many parts were boring, like the superstitious stuff, but it’s a good book that I can reread."
    },
    {
      "id": 1763824855752,
      "name": "Spider's Web",
      "author": "Agatha Christy",
      "category": "Thriller",
      "date": "2025-09-14",
      "image": "",
      "notes": "I bought this book in second hand market for Rs.70 in a good condition. i didn't even know who was Agatha christy when I bought this. Completed this book during a trip to Thirchendur. The story was average but not that bad. It was little funny here and there but the final revealing of the murderer was not that satisfying. Once readable!!"
    },
    {
      "id": 1763825123015,
      "name": "Verity",
      "author": "Colleen Hoover",
      "category": "Thriller",
      "date": "2025-09-28",
      "image": "",
      "notes": "I borrowed it from Pragathy after her recommendations for Thriller. The story was nice and it kept me in the edge of the seat throughout the read. The ending twist was satisfying and the open ending kept me hanging. Siva was not satisfied with the open ending."
    },
    {
      "id": 1763825363967,
      "name": "Artemis Fowl 2 (The Arctic Incident)",
      "author": "Eoin Colfer",
      "category": "Fiction",
      "date": "2025-11-08",
      "image": "",
      "notes": "In this book Artemis will find his father and also realizes he is useless in many scenarios. The part where they fight against opal was good and interesting. But not that good. "
    }
  ];
  fs.writeFileSync(booksFilePath, JSON.stringify(initialBooks, null, 2));
}

// Routes
app.use('/api/books', booksRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
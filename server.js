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
      id: 1, 
      name: "The Silent Patient", 
      author: "Alex Michaelides", 
      category: "Thriller", 
      date: "2024-12-15", 
      image: "", 
      notes: "A gripping psychological thriller with an unexpected twist ending. The way the author builds suspense throughout the narrative is masterful." 
    },
    { 
      id: 2, 
      name: "Atomic Habits", 
      author: "James Clear", 
      category: "Selfhelp", 
      date: "2024-11-20", 
      image: "", 
      notes: "Great insights on building good habits and breaking bad ones. Key takeaway: focus on systems, not goals." 
    },
    { 
      id: 3, 
      name: "Project Hail Mary", 
      author: "Andy Weir", 
      category: "Fiction", 
      date: "2025-01-10", 
      image: "", 
      notes: "Amazing sci-fi adventure. Rocky is the best character! The science is fascinating and the friendship between the characters is heartwarming." 
    },
    { 
      id: 4, 
      name: "The Alchemist", 
      author: "Paulo Coelho", 
      category: "Simple", 
      date: "2024-10-05", 
      image: "", 
      notes: "A beautiful and simple story about following your dreams. Easy to read in one sitting." 
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
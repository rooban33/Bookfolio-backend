const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const booksFilePath = path.join(__dirname, '../data/books.json');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/books');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'book-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Helper function to read books
const readBooks = () => {
  try {
    const data = fs.readFileSync(booksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading books:', error);
    return [];
  }
};

// Helper function to write books
const writeBooks = (books) => {
  try {
    fs.writeFileSync(booksFilePath, JSON.stringify(books, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing books:', error);
    return false;
  }
};

// GET all books
router.get('/', (req, res) => {
  const books = readBooks();
  res.json(books);
});

// GET single book by ID
router.get('/:id', (req, res) => {
  const books = readBooks();
  const book = books.find(b => b.id === parseInt(req.params.id));
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  res.json(book);
});

// POST new book (with optional image upload)
router.post('/', upload.single('image'), (req, res) => {
  try {
    const books = readBooks();
    const { name, author, category, date, notes } = req.body;
    
    if (!name || !author || !date) {
      return res.status(400).json({ message: 'Name, author, and date are required' });
    }
    
    const newBook = {
      id: Date.now(),
      name,
      author,
      category: category || 'Fiction',
      date,
      image: req.file ? `/uploads/books/${req.file.filename}` : '',
      notes: notes || ''
    };
    
    books.push(newBook);
    writeBooks(books);
    
    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
});

// PUT update book
router.put('/:id', upload.single('image'), (req, res) => {
  try {
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const { name, author, category, date, notes } = req.body;
    const oldBook = books[bookIndex];
    
    // If new image uploaded, delete old image
    if (req.file && oldBook.image) {
      const oldImagePath = path.join(__dirname, '..', oldBook.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    books[bookIndex] = {
      ...oldBook,
      name: name || oldBook.name,
      author: author || oldBook.author,
      category: category || oldBook.category,
      date: date || oldBook.date,
      notes: notes !== undefined ? notes : oldBook.notes,
      image: req.file ? `/uploads/books/${req.file.filename}` : oldBook.image
    };
    
    writeBooks(books);
    res.json(books[bookIndex]);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
});

// DELETE book
router.delete('/:id', (req, res) => {
  try {
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    
    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const book = books[bookIndex];
    
    // Delete associated image file
    if (book.image) {
      const imagePath = path.join(__dirname, '..', book.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    books.splice(bookIndex, 1);
    writeBooks(books);
    
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
});

module.exports = router;
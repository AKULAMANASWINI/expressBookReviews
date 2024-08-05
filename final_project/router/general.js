const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = async () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(400).json({ message: "Username is already taken" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const bookList = await getBooks();
        res.status(200).json(bookList);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const booksByAuthor = await new Promise((resolve, reject) => {
            const result = Object.values(books).filter(book => book.author === author);
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found by this author");
            }
        });
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const booksByTitle = await new Promise((resolve, reject) => {
            const result = Object.values(books).filter(book => book.title === title);
            if (result.length > 0) {
                resolve(result);
            } else {
                reject("No books found with this title");
            }
        });
        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

// Get book review
public_users.get('/review/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn].reviews);
            } else {
                reject("Book not found");
            }
        });
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error });
    }
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    console.log("Register route hit"); // Debugging log
    const { username, password } = req.body;

    if (!username || !password) {
        console.log("Username or password missing"); // Debugging log
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        console.log("Username already exists"); // Debugging log
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    console.log("User registered successfully:", username); // Debugging log
    return res.status(200).json({ message: "User successfully registered" });
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    // Extract the ISBN from the request parameters
    const isbn = req.params.isbn;

    // Find the book with the given ISBN
    const book = books[isbn];

    // Check if the book exists
    if (book) {
        // Return the book details
        return res.status(200).json(book);
    } else {
        // Return a 404 error if the book is not found
        return res.status(404).json({ message: "Book not found" });
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    // Extract the author from the request parameters
    const author = req.params.author;

    // Convert the books object into an array of book entries
    const booksArray = Object.entries(books);

    // Filter books by the provided author
    const matchingBooks = booksArray
        .filter(([isbn, book]) => book.author === author)
        .map(([isbn, book]) => ({ isbn, ...book }));

    // Check if any books were found
    if (matchingBooks.length > 0) {
        // Return the matching books
        return res.status(200).json(matchingBooks);
    } else {
        // Return a 404 error if no books were found
        return res.status(404).json({ message: "No books found for the given author" });
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    // Extract the title from the request parameters
    const title = req.params.title;

    // Convert the books object into an array of book entries
    const booksArray = Object.entries(books);

    // Filter books by the provided title
    const matchingBooks = booksArray
        .filter(([isbn, book]) => book.title === title)
        .map(([isbn, book]) => ({ isbn, ...book }));

    // Check if any books were found
    if (matchingBooks.length > 0) {
        // Return the matching books
        return res.status(200).json(matchingBooks);
    } else {
        // Return a 404 error if no books were found
        return res.status(404).json({ message: "No books found for the given title" });
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    // Extract the ISBN from the request parameters
    const isbn = req.params.isbn;

    // Check if the book exists in the books object
    if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];

        // Check if the book has reviews
        if (book.reviews && Object.keys(book.reviews).length > 0) {
            // Return the reviews
            return res.status(200).json(book.reviews);
        } else {
            // Return a message if no reviews are found
            return res.status(404).json({ message: "No reviews found for the given book" });
        }
    } else {
        // Return a 404 error if the book is not found
        return res.status(404).json({ message: "Book not found" });
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

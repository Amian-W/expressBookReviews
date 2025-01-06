const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Import Axios



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

/*
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(300).json(books);
});*/

// Get the book list available in the shop using Promise callbacks
public_users.get('/', function (req, res) {
    // Wrap the book list retrieval in a Promise
    const getBooks = new Promise((resolve, reject) => {
        resolve(books); // Resolve with the books object
    });

    // Handle the Promise
    getBooks
        .then((bookList) => {
            return res.status(200).json(bookList); // Return the book list
        })
        .catch((err) => {
            return res.status(500).json({ message: "Error retrieving books" });
        });
});

// Get the book list available in the shop using async-await with Axios
public_users.get('/async-await', async function (req, res) {
    try {
        // Simulate an asynchronous operation (e.g., fetching data from an external API)
        const response = await axios.get('http://localhost:3333/'); // Replace with your API endpoint
        const bookList = response.data; // Extract the book list from the response
        return res.status(200).json(bookList); // Return the book list
    } catch (err) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

/*
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
});*/

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    // Wrap the book details retrieval in a Promise
    const getBookDetails = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book); // Resolve with the book details
        } else {
            reject("Book not found"); // Reject if the book is not found
        }
    });

    // Handle the Promise
    getBookDetails
        .then((book) => {
            return res.status(200).json(book); // Return the book details
        })
        .catch((err) => {
            return res.status(404).json({ message: err }); // Return error message
        });
});

// Get book details based on ISBN using async-await with Axios
public_users.get('/isbn-async-await/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        // Simulate an asynchronous operation (e.g., fetching data from an external API)
        const response = await axios.get(`http://localhost:3333/isbn/${isbn}`); // Replace with your API endpoint
        const bookDetails = response.data; // Extract the book details from the response
        return res.status(200).json(bookDetails); // Return the book details
    } catch (err) {
        return res.status(404).json({ message: "Book not found" });
    }
});

/* 
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
});*/

// Get book details based on Author using Promise callbacks
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Wrap the book details retrieval in a Promise
    const getBooksByAuthor = new Promise((resolve, reject) => {
        const booksArray = Object.entries(books);
        const matchingBooks = booksArray
            .filter(([isbn, book]) => book.author === author)
            .map(([isbn, book]) => ({ isbn, ...book }));

        if (matchingBooks.length > 0) {
            resolve(matchingBooks); // Resolve with the matching books
        } else {
            reject("No books found for the given author"); // Reject if no books are found
        }
    });

    // Handle the Promise
    getBooksByAuthor
        .then((books) => {
            return res.status(200).json(books); // Return the matching books
        })
        .catch((err) => {
            return res.status(404).json({ message: err }); // Return error message
        });
});

// Get book details based on Author using async-await with Axios
public_users.get('/author-async-await/:author', async function (req, res) {
    const author = req.params.author;

    try {
        // Simulate an asynchronous operation (e.g., fetching data from an external API)
        const response = await axios.get(`http://localhost:3333/author/${author}`); // Replace with your API endpoint
        const booksByAuthor = response.data; // Extract the book details from the response
        return res.status(200).json(booksByAuthor); // Return the book details
    } catch (err) {
        return res.status(404).json({ message: "No books found for the given author" });
    }
});

/*
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
});*/

// Get book details based on Title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    // Wrap the book details retrieval in a Promise
    const getBooksByTitle = new Promise((resolve, reject) => {
        const booksArray = Object.entries(books);
        const matchingBooks = booksArray
            .filter(([isbn, book]) => book.title === title)
            .map(([isbn, book]) => ({ isbn, ...book }));

        if (matchingBooks.length > 0) {
            resolve(matchingBooks); // Resolve with the matching books
        } else {
            reject("No books found for the given title"); // Reject if no books are found
        }
    });

    // Handle the Promise
    getBooksByTitle
        .then((books) => {
            return res.status(200).json(books); // Return the matching books
        })
        .catch((err) => {
            return res.status(404).json({ message: err }); // Return error message
        });
});

// Get book details based on Title using async-await with Axios
public_users.get('/title-async-await/:title', async function (req, res) {
    const title = req.params.title;

    try {
        // Simulate an asynchronous operation (e.g., fetching data from an external API)
        const response = await axios.get(`http://localhost:3333/title/${title}`); // Replace with your API endpoint
        const booksByTitle = response.data; // Extract the book details from the response
        return res.status(200).json(booksByTitle); // Return the book details
    } catch (err) {
        return res.status(404).json({ message: "No books found for the given title" });
    }
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

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {
        username: "testuser",
        password: "testpassword"
    },
    {
        username: "testuser1",
        password: "testpassword1"
    }
];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        // Create a JWT token
        const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: 60 * 60 });

        // Store the token in the session
        req.session.authorization = { accessToken, username };

        return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const review = req.query.review; // Extract review from request query
    const username = req.session.authorization?.username; // Get username from session

    // Check if the user is logged in
    if (!username) {
        return res.status(403).json({ message: "User not logged in" });
    }

    // Check if the ISBN exists in the books object
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has already posted a review for this ISBN
    if (books[isbn].reviews[username]) {
        // Update the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review updated successfully" });
    } else {
        // Add a new review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully" });
    }
    /* 
    Test Request:

    URL: http://localhost:3333/customer/auth/review/1?review=This is an updated review!

    Header:

    Key: Authorization

    Value: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    */
    //return res.status(300).json({ message: "Yet to be implemented" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    const username = req.session.authorization?.username; // Get username from session
  
    // Check if the user is logged in
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    // Check if the ISBN exists in the books object
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has posted a review for this ISBN
    if (books[isbn].reviews[username]) {
      // Delete the review
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      // Return error if the user has not posted a review for this ISBN
      return res.status(404).json({ message: "Review not found" });
    }
    /* 
    Set the request type to DELETE.

    Enter the URL: http://localhost:3333/customer/auth/review/1 (replace 1 with a valid ISBN).

    Go to the Headers tab and add the Authorization header:

    Key: Authorization

    Value: Bearer <token> (replace <token> with the actual token).
    */
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // returns true if username does NOT already exist
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length === 0;
};

const authenticatedUser = (username, password) => {
  // returns true if username and password match an existing user
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

// Register a new user (if not already present in auth_users.js instead of general.js)
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required"});
  }
  if (!isValid(username)) {
    return res.status(404).json({message: "User already exists"});
  }
  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

// Login as a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required"});
  }

  if (!authenticatedUser(username, password)) {
    return res.status(208).json({message: "Invalid username or password"});
  }

  let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken, username
  };

  return res.status(200).json({message: "User successfully logged in"});
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(401).json({message: "User not logged in"});
  }

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!review) {
    return res.status(400).json({message: "Review text is required as a query parameter"});
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: `The review for the book with ISBN ${isbn} has been added/updated`,
    reviews: books[isbn].reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(401).json({message: "User not logged in"});
  }

  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message: "No review by this user found for this book"});
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: `The review for the book with ISBN ${isbn} has been deleted`,
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

const axios = require('axios');

const BASE_URL = "http://localhost:5000";

// Task 10: Get all books using async callback function
function getAllBooks(callback) {
  axios.get(`${BASE_URL}/`)
    .then((response) => {
      callback(null, response.data);
    })
    .catch((error) => {
      callback(error, null);
    });
}

// Task 11: Search by ISBN using Promises
function getBookByISBN(isbn) {
  return axios.get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching book by ISBN:", error.message);
    });
}

// Task 12: Search by Author using async/await
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
  }
}

// Task 13: Search by Title using async/await
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
  }
}

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
};

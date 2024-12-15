# Library Management System API

This document provides details on how to set up and use the Library Management System API built using Node.js, Express, and MongoDB.

---

## **Instructions to Set Up the Project**

### **Prerequisites**

- Node.js installed (v14.x or later recommended)
- MongoDB installed and running locally or remotely
- A terminal/command prompt

### **Steps to Set Up**

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/library_management
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000` (or the port specified in the `.env` file).

5. **Test the API**
   Use Postman or cURL to test the API endpoints. A Postman collection is included in the repository for easier testing.

---

## **Assumptions Made**

1. The MongoDB database has no pre-existing data.
2. Author and Book names are assumed to be unique for search queries.
3. Pagination is implemented with default `page = 1` and `limit = 10`.
4. Date fields in schemas are optional.
5. The API endpoints are secured with validation but do not include authentication or authorization.

---

## **Database Schema**

### **Authors Collection**

| Field         | Type         | Required | Description                       |
| ------------- | ------------ | -------- | --------------------------------- |
| `_id`         | **ObjectId** | Yes      | Unique identifier for each author |
| `name`        | **String**   | Yes      | Name of the author                |
| `bio`         | String       | No       | Short biography of the author     |
| `dateOfBirth` | Date         | No       | Date of birth of the author       |
| `books`       | Array        | No       | References to books by the author |

### **Books Collection**

| Field           | Type     | Required | Description                         |
| --------------- | -------- | -------- | ----------------------------------- |
| `_id`           | ObjectId | Yes      | Unique identifier for each book     |
| `title`         | String   | Yes      | Title of the book                   |
| `publishedDate` | Date     | No       | Date the book was published         |
| `genre`         | String   | No       | Genre of the book                   |
| `author`        | ObjectId | Yes      | Reference to the author of the book |

---

## **Endpoints**

### **Authors API**

- **POST** `/api/authors`: Create a new author
- **GET** `/api/authors`: Retrieve all authors with their books
- **GET** `/api/authors/:id`: Retrieve a single author by ID along with their books
- **PUT** `/api/authors/:id`: Update an author's details
- **DELETE** `/api/authors/:id`: Delete an author and remove references from books

### **Books API**

- **POST** `/api/books`: Create a new book (requires a valid author ID)
- **GET** `/api/books`: Retrieve all books with author details (supports pagination, sorting, and search)
- **GET** `/api/books/:id`: Retrieve a single book by ID with author details
- **PUT** `/api/books/:id`: Update book details and optionally change the referenced author
- **DELETE** `/api/books/:id`: Delete a book and update the author's book references

---

## **Usage Notes**

- Use `Content-Type: application/json` for all API requests.
- Ensure the database connection string (`MONGO_URI`) in `.env` is valid before starting the server.

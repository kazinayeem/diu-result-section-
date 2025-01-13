# Student Results API Project

This is a Node.js project that fetches student results and stores them in MongoDB. It uses `Express` for the web server, `Mongoose` for database interactions, and `Axios` for making HTTP requests.

## Features
- Automatically fetches student results and information from API endpoints.
- Stores results in MongoDB to avoid duplicate fetching.
- Provides an endpoint to view the results in JSON format.

---

## Prerequisites
Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (installed locally or hosted)

Additionally, ensure the following packages are installed globally:

- `npm` (comes with Node.js)

---

## Installation

1. **Clone the repository**
```bash
$ git clone <repository-url>
$ cd <project-folder>
```

2. **Install dependencies**
```bash
$ npm install
```

---

## Configuration

1. **Set up your `.env` file:**

Create a `.env` file in the root directory and add the following variables:

```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/studentResults
```

2. **Ensure MongoDB is running:**

Start your MongoDB service if you’re using a local instance:
```bash
$ mongod
```

Alternatively, if using a cloud-based MongoDB service, replace `MONGO_URI` with the correct connection string.

---

## Run the Application

1. **Start the server:**
```bash
$ npm start
```

2. **Access the API:**

- Open your browser or Postman and navigate to:
  ```
  http://localhost:3000/
  ```

---

## Project Structure
```
|-- index.js  # Main server file
|-- package.json  # Project dependencies and scripts
|-- .env  # Environment variables
|-- node_modules/  # Dependencies
```

---

## Endpoints

- **`GET /`**: Fetches all student results stored in the MongoDB database.

---

## Important Notes
- If the API endpoint (`http://software.diu.edu.bd:8006/`) becomes inaccessible, the data fetch will fail.
- Make sure the student and semester IDs are correctly configured in the `students` array inside `index.js`.
- For production, consider using `PM2` or another process manager.

---

## Troubleshooting
- **MongoDB Connection Error:**
  Ensure that MongoDB is running and the URI is correct.

- **Network Issues:**
  If you cannot access the API, check your internet connection or firewall.

---

## Example `.env` File
```
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/studentResults
```

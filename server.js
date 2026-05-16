const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
    ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false
});

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("DB connection error:", err));

// Routes

// GET books
app.get("/books", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        let query = "SELECT * FROM books";
        let countQuery = "SELECT COUNT(*) FROM books";
        let params = [];
        let countParams = [];

        if (req.query.available === "true") {
            query += " WHERE availability_status = 'Available'";
            countQuery += " WHERE availability_status = 'Available'";
        }

        query += " ORDER BY id ASC LIMIT $1 OFFSET $2";
        params.push(limit, offset);

        const result = await pool.query(query, params);

        const countResult = await pool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count);

        res.json({
            data: result.rows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// ADD book
app.post("/books", async (req, res) => {
    const { title, author, genre, year } = req.body;

    try {
        await pool.query(
            `INSERT INTO books (title, author, genre, year, availability_status)
             VALUES ($1, $2, $3, $4, 'Available')`,
            [title, author, genre, year]
        );

        res.send("Book added");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// DELETE book
app.delete("/books/:id", async (req, res) => {
    try {
        await pool.query("DELETE FROM books WHERE id = $1", [req.params.id]);
        res.send("Book deleted");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// EDIT book
app.put("/books/:id", async (req, res) => {

    const { title, author, genre, year, availability_status } = req.body;

    try {
        const result = await pool.query(
            `UPDATE books
             SET title = $1,
                 author = $2,
                 genre = $3,
                 year = $4,
                 availability_status = $5
             WHERE id = $6`,
            [title, author, genre, year, availability_status, req.params.id]
        );


        res.send("Book updated");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

app.get("/users", async (req, res) => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    res.json(result.rows);
});

app.post("/users", async (req, res) => {
    const { name, email } = req.body;

    await pool.query(
        "INSERT INTO users (name, email) VALUES ($1, $2)",
        [name, email]
    );

    res.send("User added");
});

app.get("/records", async (req, res) => {
    const result = await pool.query(`
        SELECT 
            br.id,
            u.name AS user_name,
            b.title AS book_title,
            br.borrow_date,
            br.return_date
        FROM borrow_records br
        JOIN users u ON br.user_id = u.id
        JOIN books b ON br.book_id = b.id
        ORDER BY br.id
    `);

    res.json(result.rows);
});

app.post("/records", async (req, res) => {
    const { user_id, book_id, borrow_date, return_date } = req.body;

    try {
        // insert record
        await pool.query(
            `INSERT INTO borrow_records (user_id, book_id, borrow_date, return_date)
             VALUES ($1, $2, $3, $4)`,
            [user_id, book_id, borrow_date, return_date]
        );

        // update book status
        await pool.query(
            `UPDATE books SET availability_status = 'Borrowed'
             WHERE id = $1`,
            [book_id]
        );

        res.send("OK");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put("/users/:id", async (req, res) => {
    const { name, email } = req.body;

    await pool.query(
        "UPDATE users SET name=$1, email=$2 WHERE id=$3",
        [name, email, req.params.id]
    );

    res.send("User updated");
});

app.delete("/users/:id", async (req, res) => {
    await pool.query("DELETE FROM users WHERE id=$1", [req.params.id]);
    res.send("User deleted");
});

app.put("/records/:id", async (req, res) => {
    const { borrow_date, return_date } = req.body;

    await pool.query(
        `UPDATE borrow_records 
         SET borrow_date=$1, return_date=$2 
         WHERE id=$3`,
        [borrow_date, return_date, req.params.id]
    );

    res.send("Record updated");
});

app.delete("/records/:id", async (req, res) => {
    const recordId = req.params.id;

    try {
        const result = await pool.query(
            "SELECT book_id FROM borrow_records WHERE id = $1",
            [recordId]
        );

        const bookId = result.rows[0]?.book_id;

        if (!bookId) {
            return res.status(404).send("Record not found");
        }

        await pool.query(
            "DELETE FROM borrow_records WHERE id = $1",
            [recordId]
        );

        await pool.query(
            `UPDATE books
             SET availability_status = 'Available'
             WHERE id = $1`,
            [bookId]
        );

        res.send("Record deleted and book marked available");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/borrow", async (req, res) => {
    const { user_id, book_id, borrow_date, return_date } = req.body;

    try {
        await pool.query(
            `INSERT INTO borrow_records (user_id, book_id, borrow_date, return_date)
             VALUES ($1, $2, $3, $4)`,
            [user_id, book_id, borrow_date, return_date]
        );

        await pool.query(
            `UPDATE books
             SET availability_status = 'Borrowed'
             WHERE id = $1`,
            [book_id]
        );

        res.send("Borrow record created and book updated");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
CREATE DATABASE library_db;

\c library_db;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    author VARCHAR(255),
    genre VARCHAR(100),
    year INT,
    availability_status VARCHAR(50)
);

TRUNCATE TABLE books RESTART IDENTITY;
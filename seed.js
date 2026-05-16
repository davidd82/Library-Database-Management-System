// Populates database with 30 books

const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "library_db",
    password: "your_password",
    port: 5432
});

const books = [
    ["1984", "George Orwell", "Dystopian", 1949],
    ["To Kill a Mockingbird", "Harper Lee", "Fiction", 1960],
    ["The Great Gatsby", "F. Scott Fitzgerald", "Classic", 1925],
    ["Pride and Prejudice", "Jane Austen", "Romance", 1813],
    ["The Hobbit", "J.R.R. Tolkien", "Fantasy", 1937],
    ["Harry Potter and the Sorcerer's Stone", "J.K. Rowling", "Fantasy", 1997],
    ["The Catcher in the Rye", "J.D. Salinger", "Fiction", 1951],
    ["Brave New World", "Aldous Huxley", "Dystopian", 1932],
    ["The Lord of the Rings", "J.R.R. Tolkien", "Fantasy", 1954],
    ["Animal Farm", "George Orwell", "Political Satire", 1945],

    ["The Alchemist", "Paulo Coelho", "Adventure", 1988],
    ["The Da Vinci Code", "Dan Brown", "Thriller", 2003],
    ["The Hunger Games", "Suzanne Collins", "Dystopian", 2008],
    ["Dune", "Frank Herbert", "Sci-Fi", 1965],
    ["Fahrenheit 451", "Ray Bradbury", "Dystopian", 1953],

    ["Jane Eyre", "Charlotte Brontë", "Classic", 1847],
    ["Wuthering Heights", "Emily Brontë", "Classic", 1847],
    ["The Book Thief", "Markus Zusak", "Historical Fiction", 2005],
    ["The Chronicles of Narnia", "C.S. Lewis", "Fantasy", 1950],
    ["Moby Dick", "Herman Melville", "Adventure", 1851],

    ["The Kite Runner", "Khaled Hosseini", "Drama", 2003],
    ["Life of Pi", "Yann Martel", "Adventure", 2001],
    ["The Fault in Our Stars", "John Green", "Romance", 2012],
    ["Gone Girl", "Gillian Flynn", "Thriller", 2012],
    ["Dracula", "Bram Stoker", "Horror", 1897],

    ["Frankenstein", "Mary Shelley", "Horror", 1818],
    ["The Shining", "Stephen King", "Horror", 1977],
    ["The Road", "Cormac McCarthy", "Post-Apocalyptic", 2006],
    ["The Martian", "Andy Weir", "Sci-Fi", 2011],
    ["Percy Jackson: The Lightning Thief", "Rick Riordan", "Fantasy", 2005]
];

async function seedBooks() {
    try {
        for (let book of books) {
            const [title, author, genre, year] = book;

            await pool.query(
                `INSERT INTO books (title, author, genre, year, availability_status)
                 VALUES ($1, $2, $3, $4, 'Available')`,
                [title, author, genre, year]
            );
        }

        console.log(" 30 books inserted successfully!");
        process.exit();

    } catch (err) {
        console.error(" Seeding error:", err);
        process.exit(1);
    }
}

seedBooks();
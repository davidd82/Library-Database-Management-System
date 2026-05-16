# Library Database Management System

A full-stack Library Management System built with **Express.js** and **PostgreSQL** that allows users to manage books, users, and borrowing activity through a structured relational database.

---

## Project Overview

This project simulates a real-world library system where users can:

- View books in a paginated catalog
- Add, edit, and delete books
- Create and manage users
- Borrow and return books
- Automatically track book availability based on borrowing activity

The application demonstrates full-stack web development concepts including CRUD operations, relational databases, event-driven frontend updates, and many-to-many relationships.

---

## Technologies Used

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Frontend
- HTML
- CSS
- Vanilla JavaScript

### Other Concepts
- RESTful Routing
- CRUD Operations
- Relational Database Design
- Pagination
- DOM Manipulation

---

## Database Structure

The system uses three relational tables:

### `books`
Stores book information:
- Title
- Author
- Genre
- Publication Year
- Availability Status

### `users`
Stores user information:
- Name
- Email

### `borrow_records`
Connects users and books:
- User ID
- Book ID
- Borrow Date
- Return Date

---

## Database Relationships

- One user → Many borrow records
- One book → Many borrow records
- Users and books form a **many-to-many relationship** through the `borrow_records` table

---

## Features

### Book Management
- Add new books
- Edit existing books
- Delete books
- View all books in a paginated table

### User Management
- Create users
- Manage user information

### Borrowing System
- Create borrow records
- Automatically mark books as **Borrowed**
- Automatically restore availability when records are deleted

### Frontend Functionality
- Event-driven DOM manipulation
- Dynamic table updates without page reloads
- Pagination controls for book catalog navigation

---

## How It Works

### Borrowing a Book
When a user borrows a book:
1. A new record is created in the `borrow_records` table
2. The selected book’s availability changes to **Borrowed**

### Returning a Book
When a borrow record is deleted:
1. The borrow record is removed
2. The book becomes **Available** again

---

## Dataset

The database includes 30 pre-populated books sourced from the LibraryThing cataloging platform.

LibraryThing Website:  
https://www.librarything.com/

---

## Future Improvements

- User authentication and login system
- Search and filtering functionality
- Book cover image uploads
- Due date notifications
- Responsive mobile design
- Admin dashboard

---

## Screenshots

Add screenshots of your project here.

Example:

```md
![Homepage Screenshot](images/homepage.png)
```

---

## Author

Your Name  
Computer Engineering & Computer Science Student at USC

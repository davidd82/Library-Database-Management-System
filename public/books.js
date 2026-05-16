// GET books from database
let currentPage = 1;
const limit = 10;

async function fetchBooks(page = 1) {
    const res = await fetch(`/books?page=${page}&limit=${limit}`);
    const data = await res.json();

    const table = document.getElementById("book-table-body");
    table.innerHTML = "";

    data.data.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${book.id}</td> 
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${book.year}</td>
        <td>
            <span class="status ${book.availability_status === 'Available' ? 'available' : 'borrowed'}">
                ${book.availability_status}
            </span>
        </td>
        <td>
            <span class="action-btn edit" onclick='openEditModal(${JSON.stringify(book)})'>Edit</span>
            <span class="action-btn delete" onclick="deleteBook(${book.id})">Delete</span>
        </td>
    `;

        table.appendChild(row);
    });

    renderPagination(data.totalPages, data.page);
}

// Render the pages
function renderPagination(totalPages, page) {
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const span = document.createElement("span");
        span.innerText = i;

        if (i === page) {
            span.classList.add("current-page");
        }

        span.onclick = () => {
            currentPage = i;
            fetchBooks(i);
        };

        pagination.appendChild(span);
    }
}

// ADD book
function openAddModal() {
    isEditMode = false;
    editingBookId = null;

    document.getElementById("modal-title").innerText = "Add Book";

    // clear fields
    document.getElementById("edit-title").value = "";
    document.getElementById("edit-author").value = "";
    document.getElementById("edit-genre").value = "";
    document.getElementById("edit-year").value = "";
    document.getElementById("edit-status").value = "Available";

    document.getElementById("edit-modal").style.display = "block";
}

// DELETE book
async function deleteBook(id) {
    await fetch(`/books/${id}`, { method: "DELETE" });
    fetchBooks(currentPage);
}

let editingBookId = null;
let isEditMode = false;

// EDIT book form
function openEditModal(book) {
    isEditMode = true;
    editingBookId = book.id;

    document.getElementById("modal-title").innerText = "Edit Book";

    document.getElementById("edit-title").value = book.title;
    document.getElementById("edit-author").value = book.author;
    document.getElementById("edit-genre").value = book.genre;
    document.getElementById("edit-year").value = book.year;
    document.getElementById("edit-status").value = book.availability_status;

    document.getElementById("edit-modal").style.display = "block";
}

function closeModal() {
    document.getElementById("edit-modal").style.display = "none";
}

async function submitEdit() {
    const title = document.getElementById("edit-title").value;
    const author = document.getElementById("edit-author").value;
    const genre = document.getElementById("edit-genre").value;
    const year = parseInt(document.getElementById("edit-year").value);
    const status = document.getElementById("edit-status").value;

    if (!title || !author) {
        alert("Title and Author required");
        return;
    }

    if (isEditMode) {
        // EDIT
        await fetch(`/books/${editingBookId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                author,
                genre,
                year,
                availability_status: status
            })
        });
    } else {
        // ADD
        await fetch(`/books`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                author,
                genre,
                year
            })
        });
    }

    closeModal();
    fetchBooks(currentPage);
}



// load on page start
fetchBooks();
// Fetch Users
async function fetchUsers() {
    const res = await fetch("/users");
    const users = await res.json();

    const table = document.getElementById("users-table-body");
    table.innerHTML = "";

    users.forEach(user => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>
                <span class="action-btn edit" onclick="editUser(${user.id})">Edit</span>
                <span class="action-btn delete" onclick="deleteUser(${user.id})">Delete</span>
            </td>
        `;

        table.appendChild(row);
    });
}

// Fetch Borrow Records
async function fetchRecords() {
    const res = await fetch("/records");
    const records = await res.json();

    const table = document.getElementById("records-table-body");
    table.innerHTML = "";

    records.forEach(record => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${record.user_name}</td>
            <td>${record.book_title}</td>
            <td>${formatDate(record.borrow_date)}</td>
            <td>${formatDate(record.return_date)}</td>
            <td>
                <span class="action-btn edit" onclick="editRecord(${record.id})">Edit</span>
                <span class="action-btn delete" onclick="deleteRecord(${record.id})">Delete</span>
            </td>
        `;

        table.appendChild(row);
    });
}

// Formats Date MM/DD/YYYY
function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
}

function convertToISO(dateString) {
    if (!dateString) return null;

    const [month, day, year] = dateString.split("/");

    return `${year}-${month}-${day}`; // PostgreSQL format
}

// Add User
function openAddUserModal() {
    document.getElementById("user-name").value = "";
    document.getElementById("user-email").value = "";
    document.getElementById("user-modal").style.display = "block";
}

function closeUserModal() {
    document.getElementById("user-modal").style.display = "none";
}

async function submitUser() {
    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;

    if (!name || !email) {
        alert("Name and Email required");
        return;
    }

    await fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email })
    });

    closeUserModal();
    fetchUsers();
}

// Add Record
function openAddRecordModal() {
    document.getElementById("record-borrow-date").value = "";
    document.getElementById("record-return-date").value = "";

    loadUserDropdown();   
    loadBookDropdown();   

    document.getElementById("record-modal").style.display = "block";
}

function closeRecordModal() {
    document.getElementById("record-modal").style.display = "none";
}

async function submitRecord() {
    const user_id = document.getElementById("record-user-id").value;
    const book_id = document.getElementById("record-book-id").value;
    const borrowInput = document.getElementById("record-borrow-date").value;
    const returnInput = document.getElementById("record-return-date").value;

    const borrow_date = convertToISO(borrowInput);
    const return_date = convertToISO(returnInput);

    if (!user_id || !book_id || !borrow_date) {
        alert("User ID, Book ID, and Borrow Date required");
        return;
    }

    await fetch("/records", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id,
            book_id,
            borrow_date,
            return_date
        })
    });

    


    closeRecordModal();
    fetchRecords();
}

// Drop Down for User IDs
async function loadUserDropdown() {
    const res = await fetch("/users");
    const users = await res.json();

    const select = document.getElementById("record-user-id");
    select.innerHTML = "";

    users.forEach(user => {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = `${user.name} (ID: ${user.id})`;
        select.appendChild(option);
    });
}

// Drop down for Book IDs
async function loadBookDropdown() {
    const res = await fetch("/books?available=true");
    const data = await res.json();

    const books = data.data || data;

    const select = document.getElementById("record-book-id");
    select.innerHTML = "";

    books.forEach(book => {
        const option = document.createElement("option");
        option.value = book.id;
        option.textContent = `${book.title} (ID: ${book.id})`;
        select.appendChild(option);
    });
}

// Deletes User
async function deleteUser(id) {
    await fetch(`/users/${id}`, { method: "DELETE" });
    fetchUsers();
}

// Deletes Record
async function deleteRecord(id) {
    await fetch(`/records/${id}`, { method: "DELETE" });
    fetchRecords();
}

let currentUserId = null;
let currentRecordId = null;

let editingUserId = null;
let editingRecordId = null;

// Edits User
function editUser(id) {
    currentUserId = id;

    const userRow = [...document.querySelectorAll("#users-table-body tr")]
        .find(row => row.innerHTML.includes(`deleteUser(${id})`));

    const cells = userRow.children;

    document.getElementById("edit-user-name").value = cells[1].innerText;
    document.getElementById("edit-user-email").value = cells[2].innerText;

    document.getElementById("user-edit-modal").style.display = "block";
}

function closeUserEditModal() {
    document.getElementById("user-edit-modal").style.display = "none";
}

async function submitUserEdit() {
    const name = document.getElementById("edit-user-name").value;
    const email = document.getElementById("edit-user-email").value;

    await fetch(`/users/${currentUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
    });

    closeUserEditModal();
    fetchUsers();
}

// Edits Records
function editRecord(id) {
    currentRecordId = id;

    const row = [...document.querySelectorAll("#records-table-body tr")]
        .find(row => row.innerHTML.includes(`editRecord(${id})`));

    const cells = row.children;

    document.getElementById("edit-record-borrow").value = cells[2].innerText;
    document.getElementById("edit-record-return").value = cells[3].innerText;

    document.getElementById("record-edit-modal").style.display = "block";
}

function closeRecordEditModal() {
    document.getElementById("record-edit-modal").style.display = "none";
}

async function submitRecordEdit() {
    const borrow_date = document.getElementById("edit-record-borrow").value;
    const return_date = document.getElementById("edit-record-return").value;

    await fetch(`/records/${currentRecordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrow_date, return_date })
    });

    closeRecordEditModal();
    fetchRecords();
}

// Load Page
fetchUsers();
fetchRecords();
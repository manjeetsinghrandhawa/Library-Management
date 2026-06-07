# 📚 Library Management System

A full-stack Library Management System built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) that allows students to browse books, request books, borrow and return books, while enabling administrators to manage books, users, borrowing requests, issued books, fines, and overall library operations.

---

## 🚀 Features

### 👨‍🎓 Student Features

- User Registration & Login
- JWT Authentication
- Browse Available Books
- Search Books
- Request a Book
- View Borrow Request Status
- Borrow History
- Return Books
- View Fine Details
- Responsive Dashboard

### 👨‍💼 Admin Features

- Secure Admin Login
- Dashboard Analytics
- Manage Books
  - Add Book
  - Edit Book
  - Delete Book
  - View Book Details
- Manage Students
- View Student Borrow History
- Approve Borrow Requests
- Reject Borrow Requests
- View Issued Books
- Track Overdue Books
- Fine Management
- Pagination, Filtering & Sorting Across Modules

---

## 📊 Dashboard Statistics

The Admin Dashboard displays:

- Total Students
- Total Books
- Total Borrows
- Active Borrows
- Overdue Books
- Total Pending Fine

Along with visual analytics using charts.

---

## 💰 Automatic Fine Management

The system automatically calculates fines using a Cron Job.

### Fine Rules

- Borrow duration = 14 Days
- Fine = ₹10 per day after due date
- Cron Job runs every day at 12:00 AM

Example:

| Borrow Date | Due Date | Return Date | Fine |
|------------|-----------|-------------|------|
| 06 June | 20 June | 24 June | ₹40 |

Calculation:

```text
21 June → ₹10
22 June → ₹20
23 June → ₹30
24 June → ₹40
```

The system automatically:

- Marks book as OVERDUE
- Updates fine amount daily
- Stores pending fine
- Tracks fine payment status

---

## 🏗️ Tech Stack

### Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS
- React Icons
- React Hot Toast
- Recharts

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt.js
- Node Cron

---

## 📂 Project Structure

```text
library-management-system
│
├── frontend
│   ├── src
│   │   ├── pages
│   │   ├── layouts
│   │   ├── services
│   │   ├── components
│   │   ├── routes
│   │   └── assets
│
├── backend
│   ├── Book
│   ├── Borrow
│   ├── User
│   ├── Middleware
│   ├── Config
│   ├── Routes
│   ├── Cron
│   └── Server.js
│
└── README.md
```

---

## 🔐 Authentication & Authorization

The application uses:

### JWT Authentication

Users receive a token after login.

```text
Authorization: Bearer <token>
```

### Role-Based Access Control

Roles:

```text
ADMIN
STUDENT
```

Protected Routes:

| Route | Access |
|---------|---------|
| /admin/* | Admin Only |
| /student/* | Student Only |

---

## 📖 Borrow Workflow

### Student

1. Browse Books
2. Click Request Book
3. Request goes to Admin

### Admin

1. View Borrow Requests
2. Approve or Reject Request

### On Approval

System:

- Creates Borrow Record
- Sets Borrow Date
- Sets Due Date (+14 Days)
- Reduces Available Copies

### Return Book

System:

- Marks book returned
- Updates available copies
- Calculates pending fine (if any)

---

## 📚 Book Management

Admin can:

### Add Book

Fields:

- Title
- Author
- ISBN
- Category
- Description
- Published Year
- Total Copies
- Available Copies

### View Book Details

### Edit Book

### Delete Book

---

## 🔍 Search, Filter & Sort

Implemented throughout the application.

### Books

- Search by title
- Search by author
- Search by ISBN
- Filter by category
- Filter available books
- Sort by newest
- Sort by oldest
- Sort by title

### Users

- Search by name
- Search by email
- Filter by role
- Sort by newest
- Sort by oldest

### Borrow Requests

- Search student
- Search book
- Filter by status
- Sort by newest
- Sort by oldest

### Issued Books

- Search user
- Search book
- Filter overdue books
- Filter active borrows
- Sort by due date
- Sort by days remaining

---

## 📄 API Highlights

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### Books

```http
GET    /api/v1/books/getAllBooks
GET    /api/v1/books/getSingleBook/:id
POST   /api/v1/books/addBook
PUT    /api/v1/books/updateBook/:id
DELETE /api/v1/books/deleteBook/:id
```

### Borrow Requests

```http
POST /api/v1/borrow/requestBook/:bookId
GET  /api/v1/borrow/getAllRequests
PUT  /api/v1/borrow/approveRequest/:requestId
PUT  /api/v1/borrow/rejectRequest/:requestId
```

### Borrows

```http
POST /api/v1/borrow/borrowBook/:bookId
PUT  /api/v1/borrow/returnBook/:borrowId
GET  /api/v1/borrow/history
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/library-management-system.git
```

```bash
cd library-management-system
```

---

## Backend Setup

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
PORT=8000

MONGODB_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
```

Run backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Create `.env`

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
```

Run frontend

```bash
npm run dev
```

---

## 🌐 Application URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

---

## 🧠 Learning Outcomes

This project demonstrates:

- Full Stack MERN Development
- REST API Design
- MongoDB Relationships
- Authentication & Authorization
- Role-Based Access Control
- Cron Jobs
- Pagination
- Search & Filtering
- Dashboard Analytics
- State Management
- Clean Component Architecture

---

## 🔮 Future Improvements

- Email Notifications
- Payment Gateway for Fine Collection
- Book Cover Image Upload
- Barcode Scanner Integration
- PDF Reports
- Library Membership Plans
- Real-Time Notifications
- Admin Activity Logs

---

## 👨‍💻 Author

**Manjeet Singh**

MERN Stack Developer

- React.js
- Next.js
- Node.js
- Express.js
- MongoDB

---

## ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.
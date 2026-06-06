import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./layouts/AdminLayout";
import StudentLayout from "./layouts/StudentLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import StudentDashboard from "./pages/student/Dashboard";
import Books from "./pages/admin/Books";
import Users from "./pages/admin/Users";
import BorrowRequests from "./pages/admin/BorrowRequests";
import IssuedBooks from "./pages/admin/IssuedBooks"
import ProtectedRoute from "./components/ProtectedRoute";
import StudentBooks from "./pages/student/Books";
import BorrowHistory from "./pages/student/BorrowHistory";
// import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>

<Route
 path="/"
 element={<Home />}
/>

<Route
 path="/login"
 element={<Login />}
/>

<Route
 path="/signup"
 element={<Signup />}
/>

<Route
 path="/admin"
 element={
   <ProtectedRoute role="ADMIN">
      <AdminLayout />
   </ProtectedRoute>
 }
>
 <Route
   index
   element={<AdminDashboard />}
 />

 <Route
   path="books"
   element={<Books />}
 />
 <Route
   path="users"
   element={<Users />}
 />
 <Route
    path="requests"
    element={<BorrowRequests />}
  />

  <Route
    path="issued-books"
    element={<IssuedBooks />}
  />
</Route>

<Route
 path="/student"
 element={
   <ProtectedRoute role="STUDENT">
      <StudentLayout />
   </ProtectedRoute>
 }
>
 <Route
   index
   element={<StudentDashboard />}
 />

 <Route
   path="books"
   element={<StudentBooks />}
 />
 <Route
   path="history"
   element={<BorrowHistory />}
 />
</Route>

</Routes>
    </BrowserRouter>
  );
}

export default App;
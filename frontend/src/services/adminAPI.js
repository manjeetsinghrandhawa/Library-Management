import API from "./api";

// Dashboard
export const getDashboardStatsForAdmin = () =>
  API.get("/borrow/getDashboardStatsForAdmin");

// Users
export const getAllUsers = (
  params
) =>
  API.get("/admin/users", {
    params,
  });

export const deleteUser = (userId) =>
  API.delete(`/user/deleteUser/${userId}`);

export const getUserBorrowHistory = (
  userId
) =>
  API.get(
    `/borrow/getUserBorrowHistory/${userId}`
  );

// Issued Books
export const getIssuedBooks = (
  params
) =>
  API.get(
    "/admin/getIssuedBooks",
    {
      params,
    }
  );

export const getOverdueBooks = () =>
  API.get("/borrow/getOverdueBooks");

// Requests
export const getAllRequests =
  (params) =>
    API.get(
      "/admin/getAllRequests",
      {
        params,
      }
    );

export const approveRequest = (
  requestId
) =>
  API.put(
    `/borrow/approveRequest/${requestId}`
  );

export const rejectRequest = (
  requestId
) =>
  API.put(
    `/borrow/rejectRequest/${requestId}`
  );

// Books
export const getAllBooks = (params) =>
  API.get("/books/getAllBooks", {
    params,
  });

export const addBook = (data) =>
  API.post("/books/addBook", data);

export const updateBook = (
  id,
  data
) =>
  API.put(`/books/updateBook/${id}`, data);

export const deleteBook = (id) =>
  API.delete(`/books/deleteBook/${id}`);

export const requestBook = (bookId) =>
  API.post(`/borrow/requestBook/${bookId}`);

export const getMyRequests = () =>
  API.get("/borrow/myRequests");
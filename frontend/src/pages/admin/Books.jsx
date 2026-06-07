/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import API from "../../services/api";
import { FiBookOpen } from "react-icons/fi";
import toast from "react-hot-toast";

function Books() {

  const [search, setSearch] =
  useState("");

const [category, setCategory] =
  useState("");

const [available, setAvailable] =
  useState(false);

const [sort, setSort] =
  useState("newest");

const [page, setPage] =
  useState(1);

const [totalPages, setTotalPages] =
  useState(1);

  const [books, setBooks] = useState([]);

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [selectedBook, setSelectedBook] =
    useState(null);

  const [formData, setFormData] =
    useState({
      title: "",
      author: "",
      isbn: "",
      category: "",
      description: "",
      publishedYear: "",
      totalCopies: "",
      availableCopies: "",
    });

  useEffect(() => {
  fetchBooks();
}, [
  search,
  category,
  available,
  sort,
  page,
]);

  const fetchBooks = async () => {
  try {
    const response =
      await API.get(
        `/books/getAllBooks?search=${search}&category=${category}&available=${available}&sort=${sort}&page=${page}&limit=9`
      );

    setBooks(
      response.data.books || []
    );

    setTotalPages(
      response.data.totalPages || 1
    );
  } catch (error) {
    toast.error(
      "Failed to fetch books"
    );
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const addBookHandler =
    async (e) => {
      e.preventDefault();
      console.log(formData);

      try {
        await API.post(
          "/books/addBook",
          formData
        );
        

        toast.success(
          "Book added successfully"
        );

        setShowAddModal(false);

        fetchBooks();

        setFormData({
          title: "",
          author: "",
          isbn: "",
          category: "",
          description: "",
          publishedYear: "",
          totalCopies: "",
          availableCopies: "",
        });
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to add book"
        );
         console.log(
    "Status:",
    error.response?.status
  );

  console.log(
    "Message:",
    error.response?.data
  );
      }
    };

  const viewBook =
    async (id) => {
      try {
        const response =
          await API.get(
            `/books/getSingleBook/${id}`
          );

        setSelectedBook(
          response.data.book
        );

        setShowViewModal(true);
      } catch (error) {
        toast.error(
          "Failed to fetch details"
        );
      }
    };

  const editBook =
    async (book) => {
      setSelectedBook(book);

      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        category:
          book.category,
        description:
          book.description,
        publishedYear:
          book.publishedYear,
        totalCopies:
          book.totalCopies,
        availableCopies:
          book.availableCopies,
      });

      setShowEditModal(true);
    };

  const updateBookHandler =
    async (e) => {
      e.preventDefault();

      try {
        await API.put(
          `/books/updateBook/${selectedBook._id}`,
          formData
        );

        toast.success(
          "Book updated"
        );

        setShowEditModal(false);

        fetchBooks();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Update failed"
        );
      }
    };

  const deleteBookHandler =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete this book?"
        );

      if (!confirmDelete) return;

      try {
        await API.delete(
          `/books/deleteBook/${id}`
        );

        toast.success(
          "Book deleted"
        );

        fetchBooks();
      } catch (error) {
        toast.error(
          "Delete failed"
        );
      }
    };

  return (
    <div className="p-8">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <p className="uppercase text-orange-500 font-semibold text-sm">
            Collection View
          </p>

          <h1 className="text-5xl font-bold text-slate-900">
            Books
          </h1>

          <p className="text-gray-500 mt-2">
            Browse and manage
            library books.
          </p>
        </div>

        <div className="flex gap-4">

          <span className="bg-orange-100 text-orange-600 px-5 py-2 rounded-full font-semibold">
            {books.length} showing
          </span>

          <button
            onClick={() =>
              setShowAddModal(true)
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            + Add Book
          </button>

        </div>

      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">

  <div className="grid md:grid-cols-4 gap-4">

    <input
      type="text"
      placeholder="Search title, author or ISBN..."
      value={search}
      onChange={(e) => {
        setPage(1);
        setSearch(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-600"
    />

    <input
      type="text"
      placeholder="Category"
      value={category}
      onChange={(e) => {
        setPage(1);
        setCategory(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-600"
    />

    <select
      value={sort}
      onChange={(e) => {
        setPage(1);
        setSort(
          e.target.value
        );
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 text-slate-600"
    >
      <option value="newest">
        Newest
      </option>

      <option value="oldest">
        Oldest
      </option>

      <option value="title">
        Title A-Z
      </option>
    </select>

    <label className="flex items-center gap-3 border border-slate-300 rounded-xl px-4 py-3 cursor-pointer">

      <input
        type="checkbox"
        checked={available}
        onChange={(e) => {
          setPage(1);

          setAvailable(
            e.target.checked
          );
        }}
      />

      <span className="text-slate-600">
        Available Only
      </span>

    </label>

  </div>

</div>

      {/* Books Grid */}

      <div className="grid md:grid-cols-3 gap-6">

        {books.map((book) => (
          <div
            key={book._id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <div className="text-blue-600 text-3xl mb-4">
              <FiBookOpen />
            </div>

            <h3 className="font-bold text-xl text-slate-500">
              {book.title}
            </h3>

            <p className="text-slate-500">
              {book.author}
            </p>

            <p className="mt-2 text-slate-500">
              Available:
              {" "}
              {
                book.availableCopies
              }
            </p>

            <span className="inline-block mt-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-slate-500">
              {book.availableCopies >
              0
                ? "In Stock"
                : "Checked Out"}
            </span>

            <div className="flex gap-2 mt-5">

              <button
                onClick={() =>
                  viewBook(
                    book._id
                  )
                }
                className="bg-indigo-500 text-white px-3 py-2 rounded"
              >
                View
              </button>

              <button
                onClick={() =>
                  editBook(book)
                }
                className="bg-yellow-500 text-white px-3 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteBookHandler(
                    book._id
                  )
                }
                className="bg-red-500 text-white px-3 py-2 rounded"
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

      {totalPages > 1 && (
  <div className="flex justify-center items-center gap-4 mt-10">

    <button
      disabled={page === 1}
      onClick={() =>
        setPage(page - 1)
      }
      className={`px-4 py-2 rounded-xl ${
        page === 1
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Previous
    </button>

    <div className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold">
      {page} / {totalPages}
    </div>

    <button
      disabled={
        page === totalPages
      }
      onClick={() =>
        setPage(page + 1)
      }
      className={`px-4 py-2 rounded-xl ${
        page === totalPages
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Next
    </button>

  </div>
)}

      {/* Add Modal */}

      {showAddModal && (
        <Modal
          title="Add Book"
          formData={formData}
          handleChange={
            handleChange
          }
          submitHandler={
            addBookHandler
          }
          closeModal={() =>
            setShowAddModal(false)
          }
        />
      )}

      {/* Edit Modal */}

      {showEditModal && (
        <Modal
          title="Update Book"
          formData={formData}
          handleChange={
            handleChange
          }
          submitHandler={
            updateBookHandler
          }
          closeModal={() =>
            setShowEditModal(false)
          }
        />
      )}

      {/* View Modal */}

      {showViewModal &&
        selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white p-8 rounded-xl w-[600px]">

              <h2 className="text-2xl font-bold mb-4 text-slate-500">
                {
                  selectedBook.title
                }
              </h2>

              <p className="text-slate-500">
                <strong>
                  Author:
                </strong>{" "}
                {
                  selectedBook.author
                }
              </p>

              <p className="text-slate-500">
                <strong>
                  ISBN:
                </strong>{" "}
                {
                  selectedBook.isbn
                }
              </p>

              <p className="text-slate-500">
                <strong>
                  Category:
                </strong>{" "}
                {
                  selectedBook.category
                }
              </p>

              <p className="text-slate-500">
                <strong>
                  Published:
                </strong>{" "}
                {
                  selectedBook.publishedYear
                }
              </p>

              <p className="text-slate-500">
                <strong>
                  Total Copies:
                </strong>{" "}
                {
                  selectedBook.totalCopies
                }
              </p>

              <p className="text-slate-500">
                <strong>
                  Available:
                </strong>{" "}
                {
                  selectedBook.availableCopies
                }
              </p>

              <p className="mt-4 text-slate-500">
                {
                  selectedBook.description
                }
              </p>

              <button
                onClick={() =>
                  setShowViewModal(
                    false
                  )
                }
                className="mt-5 bg-red-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>

            </div>

          </div>
        )}
    </div>
  );
}

function Modal({
  title,
  formData,
  handleChange,
  submitHandler,
  closeModal,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-xl w-[650px] space-y-4"
      >

        <h2 className="text-2xl font-bold mb-4 text-slate-500">
          {title}
        </h2>

        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded text-slate-500"
        />

        <input
          name="author"
          placeholder="Author"
          value={formData.author}
          onChange={handleChange}
          className="w-full border p-3 rounded text-slate-500"
        />

        <input
          name="isbn"
          placeholder="ISBN"
          value={formData.isbn}
          onChange={handleChange}
          className="w-full border p-3 rounded text-slate-500"
        />

        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded text-slate-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={
            formData.description
          }
          onChange={handleChange}
          className="w-full border p-3 rounded text-slate-500"
        />

        <input
          name="publishedYear"
          placeholder="Published Year"
          value={
            formData.publishedYear
          }
          onChange={handleChange}
          className="w-full border p-3 rounded text-slate-500"
        />

        <input
          name="totalCopies"
          placeholder="Total Copies"
          value={
            formData.totalCopies
          }
          onChange={handleChange}
          className="w-full border p-3 rounded text-slate-500"
        />

        <input
          name="availableCopies"
          placeholder="Available Copies"
          value={
            formData.availableCopies
          }
          onChange={handleChange}
          className="w-full border p-3 rounded text-slate-500"
        />

        <div className="flex gap-3">

          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            Save
          </button>

          <button
            type="button"
            onClick={
              closeModal
            }
            className="bg-gray-500 text-white px-5 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}

export default Books;
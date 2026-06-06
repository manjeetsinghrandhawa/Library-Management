/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiBookOpen } from "react-icons/fi";
import { FiX } from "react-icons/fi";

import API from "../../services/api";

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

  const [books, setBooks] =
    useState([]);

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

    const [selectedBook, setSelectedBook] =
  useState(null);

  useEffect(() => {
  fetchData();
}, [
  search,
  category,
  available,
  sort,
  page,
]);

  const fetchData =
    async () => {
      try {
        const [
          booksRes,
          requestsRes,
        ] = await Promise.all([
          API.get("/books/getAllBooks", {
  params: {
    search,
    category,
    available,
    sort,
    page,
    limit: 8,
  },
}),

          API.get(
            "/borrow/myRequests"
          ),
        ]);

        setBooks(
          booksRes.data.books || []
        );
        setTotalPages(
  booksRes.data.totalPages || 1
);

        setRequests(
          requestsRes.data.requests ||
            []
        );
      } catch (error) {
        toast.error(
          "Failed to load books"
        );
      } finally {
        setLoading(false);
      }
    };

  const requestBook =
    async (bookId) => {
      try {
        const response =
          await API.post(
            `/borrow/requestBook/${bookId}`
          );

        toast.success(
          response.data.message
        );

        fetchData();
      } catch (error) {
        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to request book"
        );
      }
    };

  const hasPendingRequest =
    (bookId) => {
      return requests.some(
        (req) =>
          req.book?._id === bookId &&
          req.status === "PENDING"
      );
    };

  if (loading) {
    return (
      <div className="text-center py-20">
        Loading books...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-lg">

        <span className="uppercase tracking-wider text-sm text-emerald-100">
          Library Collection
        </span>

        <h1 className="text-4xl font-bold mt-2">
          Browse Books
        </h1>

        <p className="mt-3 text-emerald-100">
          Discover books and send borrow
          requests to the library admin.
        </p>

      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">

  <div className="grid md:grid-cols-4 gap-4 text-slate-500">

    {/* Search */}

    <input
      type="text "
      placeholder="Search books..."
      value={search}
      onChange={(e) => {
        setPage(1);
        setSearch(e.target.value);
      }}
      className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
    />

    {/* Category */}

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
      className="border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
    />

    {/* Sort */}

    <select
      value={sort}
      onChange={(e) => {
        setPage(1);
        setSort(e.target.value);
      }}
      className="border border-slate-300 rounded-xl px-4 py-3"
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

    {/* Available */}

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

      Available Only

    </label>

  </div>

</div>

      {/* Count */}
      <div className="flex justify-between items-center">

        <h2 className="text-2xl font-bold text-slate-800">
          Available Books
        </h2>

        <div className="px-4 py-2 rounded-full bg-white shadow border text-slate-500">
          {books.length} Books
        </div>

      </div>

      {/* Empty State */}
      {books.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border p-16 text-center">

          <div className="text-7xl mb-4">
            📚
          </div>

          <h3 className="text-2xl font-semibold">
            No Books Found
          </h3>

          <p className="text-slate-500 mt-2">
            The library currently has
            no books available.
          </p>

        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {books.map((book) => (
            <div
              key={book._id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all"
            >

              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl mb-5">
                <FiBookOpen />
              </div>

              <h3 className="font-bold text-xl text-slate-800">
                {book.title}
              </h3>

              <p className="text-slate-500 mt-2 ">
                {book.author}
              </p>

              <div className="mt-4 space-y-2 text-sm">

                <p className="text-slate-500">
                  <span className="font-medium text-slate-500">
                    Category:
                  </span>{" "}
                  {book.category}
                </p>

                <p className="text-slate-500">
                  <span className="font-medium">
                    ISBN:
                  </span>{" "}
                  {book.isbn}
                </p>

                <p className="text-slate-500">
                  <span className="font-medium">
                    Available:
                  </span>{" "}
                  {
                    book.availableCopies
                  }
                  /
                  {
                    book.totalCopies
                  }
                </p>

              </div>

              {book.description && (
                <p className="text-slate-600 text-sm mt-4 line-clamp-3">
                  {book.description}
                </p>
              )}

              <div className="mt-6 space-y-3">

                 <button
    onClick={() =>
      setSelectedBook(book)
    }
    className=" text-slate-500 w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold transition"
  >
    View Details
  </button>

                {hasPendingRequest(
                  book._id
                ) ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-yellow-100 text-yellow-700 font-semibold"
                  >
                    Request Pending
                  </button>
                ) : book.availableCopies >
                  0 ? (
                  <button
                    onClick={() =>
                      requestBook(
                        book._id
                      )
                    }
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition"
                  >
                    Request Book
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-red-100 text-red-600 font-semibold"
                  >
                    Out Of Stock
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
      {totalPages > 1 && (

  <div className="flex justify-center items-center gap-3 mt-10">

    <button
      disabled={page === 1}
      onClick={() =>
        setPage(page - 1)
      }
      className={`px-4 py-2 rounded-xl font-medium ${
        page === 1
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Previous
    </button>

    <div className="px-5 py-2 bg-emerald-600 text-white rounded-xl font-semibold">
      {page} / {totalPages}
    </div>

    <button
      disabled={
        page === totalPages
      }
      onClick={() =>
        setPage(page + 1)
      }
      className={`px-4 py-2 rounded-xl font-medium ${
        page === totalPages
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "bg-white border hover:bg-slate-50"
      }`}
    >
      Next
    </button>

  </div>

)}
      {selectedBook && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
  onClick={() => setSelectedBook(null)}>

    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl"
    onClick={(e) =>
    e.stopPropagation()}>

      <button
        onClick={() =>
          setSelectedBook(null)
        }
        className="
          absolute top-4 right-4
          w-12 h-12
          flex items-center justify-center
          rounded-full
          bg-slate-100
          hover:bg-red-100
          text-slate-700
          hover:text-red-600
          transition
        "
      >
        <FiX size={28} />
      </button>

      <div className="flex items-center gap-4 mb-6">

        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl">
          <FiBookOpen />
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-800">
            {selectedBook.title}
          </h2>

          <p className="text-slate-500">
            by {selectedBook.author}
          </p>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-sm text-slate-500">
            Category
          </p>

          <p className="font-semibold text-slate-500">
            {
              selectedBook.category
            }
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-sm text-slate-500">
            Published Year
          </p>

          <p className="font-semibold text-slate-500">
            {
              selectedBook.publishedYear
            }
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-sm text-slate-500">
            ISBN
          </p>

          <p className="font-semibold text-slate-500">
            {selectedBook.isbn}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl">
          <p className="text-sm text-slate-500">
            Availability
          </p>

          <p className="font-semibold text-slate-500">
            {
              selectedBook.availableCopies
            }
            /
            {
              selectedBook.totalCopies
            }
          </p>
        </div>

      </div>

      <div className="mb-6">

        <h3 className="font-semibold text-lg mb-2 text-slate-500">
          Description
        </h3>

        <p className="text-slate-600 leading-relaxed text-slate-500">
          {selectedBook.description ||
            "No description available."}
        </p>

      </div>

      {selectedBook.availableCopies >
      0 ? (
        <button
          onClick={() => {
            requestBook(
              selectedBook._id
            );

            setSelectedBook(
              null
            );
          }}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          Request This Book
        </button>
      ) : (
        <button
          disabled
          className="w-full py-3 rounded-xl bg-red-100 text-red-600 font-semibold"
        >
          Out Of Stock
        </button>
      )}

    </div>

  </div>
)}

    </div>
  );
}

export default Books;
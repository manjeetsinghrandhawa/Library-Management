/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState,
} from "react";

import {
  getOverdueBooks,
} from "../../services/adminApi";

function OverdueBooks() {
  const [books, setBooks] =
    useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks =
    async () => {
      const response =
        await getOverdueBooks();

      setBooks(
        response.data.books
      );
    };

  return (
    <div>

      <h1>Overdue Books</h1>

      {books.map((item) => (
        <div key={item._id}>
          <strong>
            {item.book?.title}
          </strong>

          <p>
            Fine: ₹
            {item.fine}
          </p>
        </div>
      ))}

    </div>
  );
}

export default OverdueBooks;
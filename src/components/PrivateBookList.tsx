import React from "react";
import { Link } from "react-router-dom";
import { books } from "../mockData";

const PrivateBookList: React.FC = () => {
  const handleDelete = (id: string) => {
    // In a real app, this would delete the book from Firebase
    console.log(`Delete book with id: ${id}`);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Books</h1>
      <Link
        to="/admin/book"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Add New Book
      </Link>
      <table className="w-full bg-white shadow-md rounded my-6">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Author</th>
            <th className="py-3 px-6 text-center">Genre</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {books.map((book) => (
            <tr
              key={book.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {book.title}
              </td>
              <td className="py-3 px-6 text-left">{book.author}</td>
              <td className="py-3 px-6 text-center">{book.genre}</td>
              <td className="py-3 px-6 text-center">
                <Link
                  to={`/admin/book/${book.id}`}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrivateBookList;

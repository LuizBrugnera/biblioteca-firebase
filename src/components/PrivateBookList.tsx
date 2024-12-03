/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  userId: string;
}

const PrivateBookList = ({ user }: { user: any }) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    if (user) {
      const fetchBooks = async () => {
        const booksRef = collection(db, "books");
        const q = query(booksRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const userBooks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Book[];
        setBooks(userBooks);
      };

      fetchBooks();
    }
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "books", id));
      setBooks((prev) => prev.filter((book) => book.id !== id));
      console.log(`Deleted book with id: ${id}`);
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gerenciar Livros</h1>
      <Link
        to="/admin/book"
        className="bg-green-500 text-white px-4 py-2 rounded mb-4 inline-block"
      >
        Adicionar Novo Livro
      </Link>
      <table className="w-full bg-white shadow-md rounded my-6">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Título</th>
            <th className="py-3 px-6 text-left">Autor</th>
            <th className="py-3 px-6 text-center">Gênero</th>
            <th className="py-3 px-6 text-center">Ações</th>
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
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(book.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Excluir
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

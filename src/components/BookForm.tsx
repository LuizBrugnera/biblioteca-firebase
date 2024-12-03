/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  averageRating: number;
  userId: string;
}

const BookForm = ({ user }: { user: any }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book>({
    id: "",
    title: "",
    author: "",
    description: "",
    genre: "",
    averageRating: 0,
    userId: user?.uid || "",
  });

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        const bookRef = doc(db, "books", id);
        const bookSnapshot = await getDoc(bookRef);
        if (bookSnapshot.exists()) {
          setBook({ id: bookSnapshot.id, ...bookSnapshot.data() } as Book);
        } else {
          console.error("Book not found!");
          navigate("/my-books");
        }
      };
      fetchBook();
    }
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!user) {
        alert("Você precisa estar logado para adicionar ou editar livros.");
        return;
      }

      let bookRef;
      if (id) {
        bookRef = doc(db, "books", id);
      } else {
        bookRef = doc(collection(db, "books"));
        book.id = bookRef.id;
      }

      await setDoc(bookRef, { ...book, userId: user.uid });
      console.log("Book saved:", book);
      navigate("/my-books");
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {id ? "Editar Livro" : "Adicionar Novo Livro"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="author" className="block mb-1">
            Autor
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="genre" className="block mb-1">
            Gênero
          </label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={book.genre}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={book.description}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
            rows={4}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Salvar Livro
        </button>
      </form>
    </div>
  );
};

export default BookForm;

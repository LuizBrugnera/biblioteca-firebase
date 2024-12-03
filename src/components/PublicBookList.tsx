/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

interface User {
  id: string;
  name: string;
}

interface Review {
  id: string;
  user: User;
  rating: number;
  comment: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  reviews: Review[];
  averageRating: number;
}

const PublicBookList = ({ user }: { user: any }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [reviewInputs, setReviewInputs] = useState<
    Record<string, { rating: number; comment: string }>
  >({});
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    const fetchBooks = async () => {
      const booksCollection = collection(db, "books");
      const booksSnapshot = await getDocs(booksCollection);
      const booksData = booksSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          author: data.author,
          description: data.description,
          genre: data.genre,
          reviews: data.reviews || [],
          averageRating: calculateAverageRating(data.reviews || []),
        } as Book;
      });

      setBooks(booksData);

      const initialReviewInputs = booksData.reduce((acc, book) => {
        acc[book.id] = { rating: 0, comment: "" };
        return acc;
      }, {} as Record<string, { rating: number; comment: string }>);
      setReviewInputs(initialReviewInputs);

      const initialExpandedBooks = booksData.reduce((acc, book) => {
        acc[book.id] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setExpandedBooks(initialExpandedBooks);
    };

    fetchBooks();
  }, []);

  const handleRatingChange = (bookId: string, rating: number) => {
    setReviewInputs((prev) => ({
      ...prev,
      [bookId]: { ...prev[bookId], rating },
    }));
  };

  const handleCommentChange = (bookId: string, comment: string) => {
    setReviewInputs((prev) => ({
      ...prev,
      [bookId]: { ...prev[bookId], comment },
    }));
  };

  const toggleShowMore = (bookId: string) => {
    setExpandedBooks((prev) => ({
      ...prev,
      [bookId]: !prev[bookId],
    }));
  };

  const addOrEditReview = async (bookId: string) => {
    if (!user) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }

    const { rating, comment } = reviewInputs[bookId];
    if (!rating || !comment.trim()) {
      alert("Por favor, forneça uma avaliação e um comentário.");
      return;
    }

    const bookRef = doc(db, "books", bookId);
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    const existingReviewIndex = book.reviews.findIndex(
      (review) => review.user.id === user.uid
    );

    const updatedReviews = [...book.reviews];

    if (existingReviewIndex !== -1) {
      updatedReviews[existingReviewIndex] = {
        ...updatedReviews[existingReviewIndex],
        rating,
        comment,
      };
    } else {
      const newReview: Review = {
        id: `${Date.now()}`,
        user: { id: user.uid, name: user.displayName || "Usuário" },
        rating,
        comment,
      };
      updatedReviews.push(newReview);
    }

    const newAverageRating = calculateAverageRating(updatedReviews);

    await updateDoc(bookRef, {
      reviews: updatedReviews,
      averageRating: newAverageRating,
    });

    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.id === bookId
          ? { ...b, reviews: updatedReviews, averageRating: newAverageRating }
          : b
      )
    );

    setReviewInputs((prev) => ({
      ...prev,
      [bookId]: { rating: 0, comment: "" },
    }));
  };

  const calculateAverageRating = (reviews: { rating: number }[]): number => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((totalRating / reviews.length).toFixed(1));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? "text-yellow-500" : "text-gray-300"}
            size={20}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Biblioteca de Livros</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const showMore = expandedBooks[book.id];
          const reviewsToShow = showMore
            ? book.reviews
            : book.reviews.slice(0, 3);

          const userReview = book.reviews.find(
            (review) => review.user.id === user?.uid
          );

          return (
            <div key={book.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">por {book.author}</p>
              <p className="text-sm text-gray-500 mb-2">Gênero: {book.genre}</p>
              <p className="mb-2">{book.description}</p>
              <p className="text-sm font-semibold mb-4">
                Avaliação Média: {renderStars(book.averageRating)}
              </p>
              {user ? (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">
                    {userReview
                      ? "Editar sua Avaliação:"
                      : "Deixe sua Avaliação:"}
                  </h3>
                  <div className="flex items-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        onClick={() => handleRatingChange(book.id, star)}
                        className={`cursor-pointer ${
                          star <=
                          (reviewInputs[book.id]?.rating ||
                            userReview?.rating ||
                            0)
                            ? "text-yellow-500"
                            : "text-gray-300"
                        }`}
                        size={20}
                      />
                    ))}
                  </div>
                  <textarea
                    placeholder="Escreva seu comentário..."
                    value={
                      reviewInputs[book.id]?.comment ||
                      userReview?.comment ||
                      ""
                    }
                    onChange={(e) =>
                      handleCommentChange(book.id, e.target.value)
                    }
                    className="w-full border rounded p-2 mb-2"
                  />
                  <button
                    onClick={() => addOrEditReview(book.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                    {userReview ? "Editar Avaliação" : "Enviar Avaliação"}
                  </button>
                </div>
              ) : (
                <p className="text-red-500">
                  Faça login para deixar uma avaliação.
                </p>
              )}
              <div>
                <h3 className="font-semibold mb-2">Avaliações:</h3>
                {reviewsToShow.map((review) => (
                  <div key={review.id} className="mb-4 border-b pb-2">
                    <p className="font-bold">{review.user.name}:</p>
                    <p className="text-sm text-gray-600">"{review.comment}"</p>
                    {renderStars(review.rating)}
                  </div>
                ))}
                {book.reviews.length > 3 && (
                  <button
                    onClick={() => toggleShowMore(book.id)}
                    className="text-blue-500 underline mt-2"
                  >
                    {showMore ? "Mostrar Menos" : "Mostrar Mais"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicBookList;

import React, { useState } from "react";
import { books, Book } from "../mockData";
import { FaStar } from "react-icons/fa";

const PublicBookList: React.FC = () => {
  const userId = "user5"; // ID do usuário atual (mockado)
  const userName = "Usuário Novo"; // Nome do usuário atual (mockado)
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books);
  const [reviewInputs, setReviewInputs] = useState<
    Record<string, { rating: number; comment: string }>
  >(
    books.reduce((acc, book) => {
      acc[book.id] = { rating: 0, comment: "" };
      return acc;
    }, {} as Record<string, { rating: number; comment: string }>)
  );
  const [expandedBooks, setExpandedBooks] = useState<Record<string, boolean>>(
    books.reduce((acc, book) => {
      acc[book.id] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

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

  const addOrEditReview = (bookId: string) => {
    const { rating, comment } = reviewInputs[bookId];
    if (!rating || !comment.trim()) {
      alert("Por favor, forneça uma avaliação e um comentário.");
      return;
    }

    setFilteredBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id !== bookId) return book;

        const existingReviewIndex = book.reviews.findIndex(
          (review) => review.user.id === userId
        );

        if (existingReviewIndex !== -1) {
          // Editar avaliação existente
          const updatedReviews = [...book.reviews];
          updatedReviews[existingReviewIndex] = {
            ...updatedReviews[existingReviewIndex],
            rating,
            comment,
          };

          return {
            ...book,
            reviews: updatedReviews,
            averageRating: calculateAverageRating(updatedReviews),
          };
        }

        // Adicionar nova avaliação
        return {
          ...book,
          reviews: [
            ...book.reviews,
            {
              id: `${book.reviews.length + 1}`,
              user: { id: userId, name: userName },
              rating,
              comment,
            },
          ],
          averageRating: calculateAverageRating([...book.reviews, { rating }]),
        };
      })
    );

    // Reset input fields for the current book
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
        {filteredBooks.map((book) => {
          const showMore = expandedBooks[book.id];
          const reviewsToShow = showMore
            ? book.reviews
            : book.reviews.slice(0, 3);

          return (
            <div key={book.id} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">{book.title}</h2>
              <p className="text-gray-600 mb-2">por {book.author}</p>
              <p className="text-sm text-gray-500 mb-2">Gênero: {book.genre}</p>
              <p className="mb-2">{book.description}</p>
              <p className="text-sm font-semibold mb-4">
                Avaliação Média: {renderStars(book.averageRating)}
              </p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Deixe sua Avaliação:</h3>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      onClick={() => handleRatingChange(book.id, star)}
                      className={`cursor-pointer ${
                        star <= reviewInputs[book.id].rating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      size={20}
                    />
                  ))}
                </div>
                <textarea
                  placeholder="Escreva seu comentário..."
                  value={reviewInputs[book.id].comment}
                  onChange={(e) => handleCommentChange(book.id, e.target.value)}
                  className="w-full border rounded p-2 mb-2"
                />
                <button
                  onClick={() => addOrEditReview(book.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Enviar Avaliação
                </button>
              </div>
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

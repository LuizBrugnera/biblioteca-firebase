export interface Review {
  id: string;
  user: {
    id: string;
    name: string;
  };
  rating: number; // Nota dada pelo usuário
  comment: string; // Comentário do usuário
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  reviews: Review[]; // Array de avaliações
  averageRating: number; // Calculado dinamicamente
}
export const books: Book[] = [
  {
    id: "1",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A classic of modern American literature.",
    genre: "Fiction",
    reviews: [
      {
        id: "1",
        user: { id: "user1", name: "Alice" },
        rating: 5,
        comment: "An absolute masterpiece!",
      },
      {
        id: "2",
        user: { id: "user2", name: "Bob" },
        rating: 4,
        comment: "Thought-provoking and well-written.",
      },
    ],
    averageRating: calculateAverageRating([{ rating: 5 }, { rating: 4 }]), // Calculado dinamicamente
  },
  {
    id: "2",
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel.",
    genre: "Science Fiction",
    reviews: [
      {
        id: "3",
        user: { id: "user3", name: "Charlie" },
        rating: 4,
        comment: "A chilling view of the future.",
      },
      {
        id: "4",
        user: { id: "user4", name: "Dana" },
        rating: 5,
        comment: "A must-read for everyone.",
      },
    ],
    averageRating: calculateAverageRating([{ rating: 4 }, { rating: 5 }]),
  },
];

// Função para calcular a classificação média
function calculateAverageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
}

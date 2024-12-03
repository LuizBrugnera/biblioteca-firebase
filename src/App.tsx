import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import PublicBookList from "./components/PublicBookList";
import PrivateBookList from "./components/PrivateBookList";
import BookForm from "./components/BookForm";
import ReviewForm from "./components/ReviewForm";
import Login from "./components/Login";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Book Library
            </Link>
            <div>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="text-gray-800 hover:text-gray-600 mx-4"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-gray-800 hover:text-gray-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-gray-800 hover:text-gray-600">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<PublicBookList />} />
          <Route
            path="/login"
            element={<Login onLogin={() => setIsAuthenticated(true)} />}
          />
          <Route
            path="/admin"
            element={
              isAuthenticated ? (
                <PrivateBookList />
              ) : (
                <Login onLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/admin/book/:id?"
            element={
              isAuthenticated ? (
                <BookForm />
              ) : (
                <Login onLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route
            path="/admin/review/:bookId"
            element={
              isAuthenticated ? (
                <ReviewForm />
              ) : (
                <Login onLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;

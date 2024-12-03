/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Route, Routes, Link } from "react-router-dom";
import PublicBookList from "./components/PublicBookList";
import PrivateBookList from "./components/PrivateBookList";
import BookForm from "./components/BookForm";
import ReviewForm from "./components/ReviewForm";
import Login from "./components/Login";

const App: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const handleLogin = (userData: any) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {user && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              ) : null}
              <Link to="/" className="text-xl font-bold text-gray-800">
                Book Library
              </Link>
            </div>
            <div>
              {user ? (
                <>
                  <span className="text-gray-800 mx-4">{user.displayName}</span>
                  <Link
                    to="/admin"
                    className="text-gray-800 hover:text-gray-600 mx-4"
                  >
                    Admin
                  </Link>
                  <button
                    onClick={handleLogout}
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
          <Route path="/" element={<PublicBookList user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/admin"
            element={
              user ? (
                <PrivateBookList user={user} />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/admin/book/:id?"
            element={
              user ? <BookForm user={user} /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/admin/review/:bookId"
            element={user ? <ReviewForm /> : <Login onLogin={handleLogin} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;

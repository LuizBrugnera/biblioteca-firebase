/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, githubProvider, signInWithPopup } from "../firebaseConfig"; // Certifique-se de configurar o Firebase corretamente

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleGitHubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      console.log("Usuário logado:", user);
      onLogin(user);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login com GitHub:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login com GitHub</h1>
      <button
        onClick={handleGitHubLogin}
        className="bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center space-x-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.37-1.343-3.37-1.343-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.004.071 1.532 1.032 1.532 1.032.892 1.529 2.341 1.087 2.91.831.092-.647.35-1.087.637-1.337-2.22-.253-4.555-1.112-4.555-4.945 0-1.092.39-1.986 1.029-2.686-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.845c.851.004 1.705.114 2.504.335 1.91-1.294 2.75-1.025 2.75-1.025.544 1.377.201 2.394.098 2.647.64.7 1.029 1.594 1.029 2.686 0 3.842-2.337 4.688-4.565 4.936.36.31.68.92.68 1.852 0 1.337-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.137 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z"
            clipRule="evenodd"
          />
        </svg>
        <span>Login com GitHub</span>
      </button>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE from "../lib/api";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setSubmitting(true);
    
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, { name, email, password }, { withCredentials: true });
      if (res.data.success) {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <svg
            width="44"
            height="44"
            viewBox="0 0 40 40"
            fill="none"
            className="mx-auto mb-4"
          >
            <title>Coinbase Logo</title>
            <circle cx="20" cy="20" r="20" fill="#0052FF" />
            <path
              d="M20 6C12.268 6 6 12.268 6 20s6.268 14 14 14 14-6.268 14-14S27.732 6 20 6zm-3.6 16.8a3.6 3.6 0 110-7.2h7.2a3.6 3.6 0 110 7.2h-7.2z"
              fill="white"
            />
          </svg>
          <h1 className="text-2xl sm:text-3xl font-extrabold">
            Create account
          </h1>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm text-center">
            Demo app – do not use your real password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              placeholder="Your Name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              placeholder="Enter password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none"
              placeholder="Confirm password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors mt-6"
          >
            {submitting ? "Signing up..." : "Sign up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

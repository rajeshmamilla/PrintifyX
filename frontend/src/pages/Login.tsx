import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      console.log("Login success:", data);

      // store JWT token and user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("role", data.role);
      localStorage.setItem("email", email);

      // later → redirect
      navigate("/");
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        setError("Connection refused. Please check if the backend is running on port 8081.");
      } else {
        setError(err.message || "Invalid email or password");
      }
    }
  };

  return (
    <>
      <Header />
      <Navbar />

      <main className="min-h-[70vh]">
        <div className="mx-auto mt-20 max-w-[400px] rounded bg-white p-10 shadow-lg">
          <h2 className="mb-5 text-center text-2xl font-semibold">Login</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-orange-400"
            />

            <button
              type="submit"
              className="rounded bg-orange-500 py-3 text-white transition-colors hover:bg-orange-600"
            >
              Login
            </button>
          </form>

          {error && (
            <p className="mt-3 text-center text-sm text-red-500">{error}</p>
          )}

          <p className="mt-4 text-center text-sm flex justify-center gap-4">
            <span>
              Don’t have an account?{" "}
              <Link to="/register" className="text-orange-500 hover:underline">
                Register
              </Link>
            </span>
            <span className="text-gray-300">|</span>
            <Link to="/forgot-password" university-id="forgot-password-link" className="text-orange-500 hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;

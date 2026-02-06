import { useState } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      console.log("Login success:", data);

      // TEMP: store token
      localStorage.setItem("token", data.token);

      // later → redirect
    } catch {
      setError("Invalid email or password");
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

          <p className="mt-4 text-center text-sm">
            Don’t have an account?{" "}
            <span className="cursor-pointer text-orange-500 hover:underline">
              Register
            </span>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;

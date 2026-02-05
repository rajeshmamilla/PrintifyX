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

      // later → redirect to home / dashboard
    } catch (err: any) {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <Header />
      <Navbar />

      <main>
        <div className="auth-container">
          <h2>Login</h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <p className="auth-switch">
            Don’t have an account? <span>Register</span>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;

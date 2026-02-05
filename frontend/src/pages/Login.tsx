import Header from "../components/Header";
import Navbar from "../components/Navbar";

const Login = () => {
  return (
    <>
      <Header />
      <Navbar />

      <main>
        <div className="auth-container">
          <h2>Login</h2>

          <form className="auth-form">
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />

            <button type="submit">Login</button>
          </form>

          <p className="auth-switch">
            Don’t have an account? <span>Register</span>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;

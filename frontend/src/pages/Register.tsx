import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { registerUser } from "../services/api";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        try {
            const data = await registerUser(email, password);
            console.log("Registration success:", data);
            setSuccess(true);
            alert("Registration Successful");
            navigate("/login");
            // later → redirect to login or auto-login
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    return (
        <>
            <Header />
            <Navbar />

            <main className="min-h-[70vh]">
                <div className="mx-auto mt-20 max-w-[400px] rounded-xl bg-white p-10 shadow-lg border border-gray-100">
                    <h2 className="mb-5 text-center text-2xl font-semibold">Register</h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="rounded-xl border border-gray-300 px-3 py-3 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded-xl border border-gray-300 px-3 py-3 focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />

                        <button
                            type="submit"
                            className="rounded-xl bg-black py-3 text-white transition-all hover:bg-gray-900 font-bold shadow-lg shadow-gray-100"
                        >
                            Register
                        </button>
                    </form>

                    {error && (
                        <p className="mt-3 text-center text-sm text-red-500">{error}</p>
                    )}

                    {success && (
                        <p className="mt-3 text-center text-sm text-green-500">
                            Registration successful! You can now{" "}
                            <Link to="/login" className="text-black font-bold hover:underline">
                                Login
                            </Link>
                        </p>
                    )}

                    {!success && (
                        <p className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link to="/login" className="text-black font-bold hover:underline">
                                Login
                            </Link>
                        </p>
                    )}
                </div>
            </main>
        </>
    );
};

export default Register;

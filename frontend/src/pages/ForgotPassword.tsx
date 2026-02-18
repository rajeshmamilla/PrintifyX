import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic for password reset request goes here
        console.log("Password reset requested for:", email);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-[#f5f8fb] flex flex-col">
            <Header />
            <Navbar />

            <main className="flex-grow flex items-center justify-center py-12 px-6">
                <div className="w-full max-w-[450px] bg-white rounded-lg border border-gray-100 shadow-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="p-8 sm:p-10">
                        {!submitted ? (
                            <>
                                <div className="mb-8 text-center">
                                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail size={32} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900">Forgot Password?</h2>
                                    <p className="text-gray-500 mt-2 text-sm">No worries! Enter your email and we'll send you reset instructions.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="e.g. rahul@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-md outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all font-medium text-gray-700"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-orange-500 text-white font-bold text-sm rounded-md hover:bg-orange-600 transition-all shadow-lg shadow-orange-100"
                                    >
                                        SEND RESET LINK
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
                                <p className="text-gray-500 text-sm mb-8">
                                    We've sent password reset instructions to <br />
                                    <span className="font-bold text-gray-900">{email}</span>
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="text-orange-500 font-bold hover:underline text-sm"
                                >
                                    Didn't receive email? Try again
                                </button>
                            </div>
                        )}

                        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                            <Link to="/login" className="inline-flex items-center gap-2 text-gray-500 font-bold text-xs hover:text-gray-900 transition-colors uppercase tracking-widest">
                                <ArrowLeft size={14} /> Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ForgotPassword;

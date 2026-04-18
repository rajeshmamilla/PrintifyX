import { LoginForm } from "@/components/login-form"
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-grow flex w-full items-center justify-center p-6 md:p-10 bg-gray-50/50">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

import { RegisterForm } from "@/components/register-form"
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-grow flex w-full items-center justify-center p-6 md:p-10 bg-gray-50/50">
        <div className="w-full max-w-sm">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}

import { LoginForm } from "@/components/login-form"
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Login() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="flex min-h-[70vh] w-full items-center justify-center p-6 md:p-10 bg-gray-50/50">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </>
  )
}

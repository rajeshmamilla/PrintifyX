import { RegisterForm } from "@/components/register-form"
import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Register() {
  return (
    <>
      <Header />
      <Navbar />
      <div className="flex min-h-[70vh] w-full items-center justify-center p-6 md:p-10 bg-gray-50/50">
        <div className="w-full max-w-sm">
          <RegisterForm />
        </div>
      </div>
    </>
  )
}

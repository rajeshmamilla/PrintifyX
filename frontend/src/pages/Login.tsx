import { LoginForm } from "@/components/login-form"
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Navbar />
      <main className="flex-grow flex w-full bg-white relative overflow-hidden">
        {/* Left Side: Image/Branding (Visible on lg+) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-50 items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 w-full max-w-xl animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="mb-10">
              <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900 mb-4 leading-tight">
                Elevate Your Brand with <span className="text-zinc-500">PrintifyX</span>
              </h2>
              <p className="text-lg text-zinc-500 font-medium max-w-md">
                Professional quality banners, business cards, and marketing materials tailored for your business success.
              </p>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20">
               <img 
                 src="/business-printing-graphic.png" 
                 alt="Premium Business Printing" 
                 className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
            </div>

            <div className="mt-12 flex items-center gap-8">
               <div>
                 <p className="text-2xl font-bold text-zinc-900">50k+</p>
                 <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Projects Delivered</p>
               </div>
               <div className="w-px h-8 bg-zinc-200"></div>
               <div>
                 <p className="text-2xl font-bold text-zinc-900">24h</p>
                 <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Standard Turnaround</p>
               </div>
            </div>
          </div>

          {/* Decorative blur blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-zinc-200/50 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-zinc-100/50 rounded-full blur-[100px]"></div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white relative">
          <div className="absolute inset-0 lg:hidden opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          <div className="w-full max-w-[400px] relative z-10 animate-in fade-in zoom-in-95 duration-700">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}


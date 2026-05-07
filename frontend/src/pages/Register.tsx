import { RegisterForm } from "@/components/register-form"
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";

export default function Register() {
  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <main className="flex-grow flex w-full bg-white relative overflow-hidden">
        {/* Left Side: Image/Branding (Visible on lg+) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-50 flex-col items-center justify-center p-16 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 w-full max-lg animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-3 leading-tight">
                Partner with <span className="text-zinc-500">PrintifyX</span>
              </h2>
              <p className="text-base text-zinc-500 font-medium max-w-md">
                Create an account to manage your business printing orders, from banners to premium business cards.
              </p>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white/20 max-h-[380px]">
               <img 
                 src="/business-printing-graphic.png" 
                 alt="Premium Business Printing" 
                 className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
            </div>

            <div className="mt-8 flex items-center gap-8">
               <div className="flex flex-col">
                 <span className="text-zinc-900 font-bold text-lg leading-tight">Matte & Gloss</span>
                 <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Premium Finishes</span>
               </div>
               <div className="w-px h-6 bg-zinc-200"></div>
               <div className="flex flex-col">
                 <span className="text-zinc-900 font-bold text-lg leading-tight">Bulk Pricing</span>
                 <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Enterprise Ready</span>
               </div>
            </div>
          </div>

          <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-zinc-200/50 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-zinc-100/50 rounded-full blur-[100px]"></div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 bg-white relative">
          <div className="absolute inset-0 lg:hidden opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
            {/* Logo above form */}
            <Link to="/" className="mb-6 hover:opacity-80 transition-opacity">
              <img src={Logo} alt="PrintifyX Logo" className="h-16 w-auto" />
            </Link>

            <RegisterForm />

            {/* Subtle Back to Home */}
            <Link to="/" className="mt-8 text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-colors uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-px bg-zinc-200"></span>
              Back to Home
              <span className="w-4 h-px bg-zinc-200"></span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}


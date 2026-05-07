import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, sendRegisterOtp, verifyOtp } from "../services/api";
import { Eye, EyeOff, User, Mail, Lock, ShieldCheck, ArrowRight } from "lucide-react";

// ── OTP Input Component ────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1); // digits only
    const next = [...value];
    next[i] = char;
    onChange(next);
    if (char && i < 5) {
      refs.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = Array(6).fill("");
    pasted.forEach((ch, i) => { next[i] = ch; });
    onChange(next);
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className={cn(
            "w-10 h-12 text-center text-lg font-bold rounded-xl border-2 bg-white transition-all outline-none",
            digit 
              ? "border-zinc-900 ring-2 ring-zinc-100" 
              : "border-gray-100 focus:border-zinc-900 focus:ring-4 focus:ring-zinc-50"
          )}
        />
      ))}
    </div>
  );
}

// ── Register Form Component ───────────────────────────────────────────────────
export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP step
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);

  // Countdown timer for resend
  useEffect(() => {
    let interval: any;
    if (step === "otp" && resendDisabled) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setResendDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendDisabled]);

  const startTimer = () => {
    setResendDisabled(true);
    setTimer(60);
  };

  // ── Step 1: submit registration ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await sendRegisterOtp(email);
      setStep("otp");
      startTimer();
    } catch (err: any) {
      setError(err.message || "Failed to send verification code.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: verify OTP & Register ──
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }
    
    setOtpLoading(true);
    try {
      await verifyOtp(email, code, "REGISTRATION");
      await registerUser(email, password);
      navigate("/login");
    } catch (err: any) {
      setOtpError(err.message || "Verification failed. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp(Array(6).fill(""));
      setOtpError("");
      await sendRegisterOtp(email);
      startTimer();
    } catch (err: any) {
      setOtpError(err.message || "Failed to resend OTP.");
    }
  };

  // ── OTP step UI ──
  if (step === "otp") {
    return (
      <div className={cn("flex flex-col gap-4", className)} {...props}>
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100">
          <CardHeader className="space-y-1 pb-4 pt-6 text-center">
            <div className="flex items-center justify-center mb-1">
               <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-200">
                  <ShieldCheck className="text-white w-5 h-5" />
               </div>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-gray-900">Verify Email</CardTitle>
            <CardDescription className="text-gray-400 text-xs font-medium px-4">
              Code sent to <span className="text-zinc-900 font-bold">{email}</span>.{" "}
              <button
                type="button"
                className="text-zinc-400 font-bold hover:text-zinc-900 transition-colors"
                onClick={() => { setStep("form"); setOtp(Array(6).fill("")); setOtpError(""); }}
              >
                Change
              </button>
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-6">
            <form onSubmit={handleVerifyOtp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    6-Digit Verification Code
                  </Label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>
                {otpError && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                    <p className="text-[10px] text-red-600 font-bold text-center">{otpError}</p>
                  </div>
                )}
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full h-10 font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-lg shadow-zinc-100 transition-all active:scale-[0.98]"
                  >
                    {otpLoading ? (
                      <div className="flex items-center gap-2">
                         <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                         <span className="text-sm">Verifying...</span>
                      </div>
                    ) : <span className="text-sm">Verify & Register</span>}
                  </Button>
                  <p className="text-center text-xs font-medium text-gray-400">
                    No code?{" "}
                    <button
                      type="button"
                      disabled={resendDisabled}
                      onClick={handleResendOtp}
                      className={cn(
                        "font-bold transition-colors",
                        resendDisabled
                          ? "text-gray-200 cursor-not-allowed"
                          : "text-zinc-900 hover:underline"
                      )}
                    >
                      Resend {resendDisabled && `(${timer}s)`}
                    </button>
                  </p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Registration form UI ──
  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100">
        <CardHeader className="space-y-1 pb-4 pt-6">
          <CardTitle className="text-xl font-bold text-center tracking-tight text-gray-900">Create Account</CardTitle>
          <CardDescription className="text-center text-gray-400 text-xs font-medium">
            Join PrintifyX for a premium experience
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 px-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="h-10 pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-zinc-900 placeholder:text-gray-400 text-sm font-medium"
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-zinc-900 placeholder:text-gray-400 text-sm font-medium"
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password" title="Must be at least 8 characters" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 pl-10 pr-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-zinc-900 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zinc-900 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-10 pl-10 pr-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-zinc-900 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zinc-900 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 animate-in fade-in slide-in-from-top-1">
                  <p className="text-[10px] text-red-600 font-bold text-center">{error}</p>
                </div>
              )}

              <div className="space-y-3 pt-1">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-lg shadow-zinc-100 transition-all active:scale-[0.98]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                       <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       <span className="text-sm">Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-white px-3 text-gray-300 font-bold tracking-widest">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 font-bold border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  onClick={() => {
                    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api";
                    const oauthUrl = baseUrl.replace(/\/api$/, "") + "/oauth2/authorization/google";
                    window.location.href = oauthUrl;
                  }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span className="text-sm">Google</span>
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-[13px]">
              <span className="text-gray-400 font-medium">Already have an account?</span>{" "}
              <Link to="/login" className="text-zinc-900 font-bold hover:underline underline-offset-4 transition-all">
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

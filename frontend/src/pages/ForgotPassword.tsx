import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { sendForgotOtp, verifyOtp, resetPassword } from "../services/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "../assets/logo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Key, ShieldCheck, CheckCircle2 } from "lucide-react";

// ── OTP Input ──────────────────────────────────────────────────────────────────
function OtpInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.replace(/\D/g, "").slice(-1);
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

// ── Types ──────────────────────────────────────────────────────────────────────
type Step = "email" | "otp" | "reset";

// ── Main Component ─────────────────────────────────────────────────────────────
const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");

  // Step 1
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // Step 2
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);

  // Step 3
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [timer, setTimer] = useState(60);

  // Countdown timer for resend
  const startTimer = () => {
    setResendDisabled(true);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setResendDisabled(false);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // ── Step 1: send OTP ──
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setResetError(""); 
    try {
      await sendForgotOtp(email);
      setStep("otp");
      startTimer();
    } catch (err: any) {
      setResetError(err.message || "Failed to send verification code.");
    } finally {
      setEmailLoading(false);
    }
  };

  // ── Step 2: verify OTP ──
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
      await verifyOtp(email, code, "FORGOT_PASSWORD");
      setStep("reset");
    } catch (err: any) {
      setOtpError(err.message || "Invalid or expired OTP.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtp(Array(6).fill(""));
      setOtpError("");
      await sendForgotOtp(email);
      startTimer();
    } catch (err: any) {
      setOtpError(err.message || "Failed to resend OTP.");
    }
  };

  // ── Step 3: reset password ──
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (newPassword.length < 8) {
      setResetError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(email, newPassword);
      setResetDone(true);
    } catch (err: any) {
      setResetError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // ── Card Content by step ──
  const renderCard = () => {
    if (resetDone) {
      return (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100">
          <CardHeader className="space-y-0.5 pb-2 pt-4 text-center">
            <div className="flex items-center justify-center mb-0.5">
               <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-100">
                  <CheckCircle2 className="text-white w-4 h-4" />
               </div>
            </div>
            <CardTitle className="text-lg font-bold tracking-tight text-gray-900 leading-tight">Success!</CardTitle>
            <CardDescription className="text-gray-400 text-[11px] font-medium">
              Your password has been updated.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-6">
            <div className="flex flex-col gap-4">
              <p className="text-xs text-gray-400 font-medium text-center">
                You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="flex items-center justify-center w-full h-10 rounded-lg font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-100 transition-all active:scale-[0.98]"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (step === "email") {
      return (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100">
          <CardHeader className="space-y-0.5 pb-2 pt-4 text-center">
            <div className="flex items-center justify-center mb-0.5">
               <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-200">
                  <Key className="text-white w-4 h-4" />
               </div>
            </div>
            <CardTitle className="text-lg font-bold tracking-tight text-gray-900 leading-tight">Forgot Password</CardTitle>
            <CardDescription className="text-gray-400 text-[11px] font-medium">
              We'll send a code to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-8 px-6">
            <form onSubmit={handleSendOtp}>
              <div className="flex flex-col gap-4">
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
                <Button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full h-10 font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-lg shadow-zinc-100 transition-all active:scale-[0.98]"
                >
                  {emailLoading ? (
                    <div className="flex items-center gap-2">
                       <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                       <span className="text-sm">Sending...</span>
                    </div>
                  ) : <span className="text-sm">Send Reset Code</span>}
                </Button>
                {resetError && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                    <p className="text-[10px] text-red-600 font-bold text-center">{resetError}</p>
                  </div>
                )}
              </div>
              <div className="mt-6 text-center text-sm">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-gray-400 hover:text-zinc-900 font-bold underline underline-offset-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-[13px]">Back to Login</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    }

    if (step === "otp") {
      return (
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100">
          <CardHeader className="space-y-0.5 pb-2 pt-4 text-center">
            <div className="flex items-center justify-center mb-0.5">
               <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-200">
                  <ShieldCheck className="text-white w-4 h-4" />
               </div>
            </div>
            <CardTitle className="text-lg font-bold tracking-tight text-gray-900 leading-tight">Verify Code</CardTitle>
            <CardDescription className="text-gray-400 text-[11px] font-medium">
              Code sent to <span className="text-zinc-900 font-bold">{email}</span>.{" "}
              <button
                type="button"
                className="text-zinc-400 font-bold hover:text-zinc-900 transition-colors"
                onClick={() => { setStep("email"); setOtp(Array(6).fill("")); setOtpError(""); }}
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
                    ) : <span className="text-sm">Verify Code</span>}
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
      );
    }

    return (
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-100">
        <CardHeader className="space-y-0.5 pb-2 pt-4 text-center">
          <div className="flex items-center justify-center mb-0.5">
             <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg shadow-zinc-200">
                <Lock className="text-white w-4 h-4" />
             </div>
          </div>
          <CardTitle className="text-lg font-bold tracking-tight text-gray-900 leading-tight">New Password</CardTitle>
          <CardDescription className="text-gray-400 text-[11px] font-medium">
            Set a strong password for your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 px-6">
          <form onSubmit={handleReset}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="newPassword" title="Must be at least 8 characters" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">New Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-10 pl-10 pr-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-zinc-900 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zinc-900 transition-colors"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-zinc-900 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-10 pl-10 pr-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all rounded-lg border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-zinc-900 text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-zinc-900 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              {resetError && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                  <p className="text-[10px] text-red-600 font-bold text-center">{resetError}</p>
                </div>
              )}
              <Button
                type="submit"
                disabled={resetLoading}
                className="w-full h-10 font-bold bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg shadow-lg shadow-zinc-100 transition-all active:scale-[0.98] mt-1"
              >
                {resetLoading ? (
                  <div className="flex items-center gap-2">
                     <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                     <span className="text-sm">Updating...</span>
                  </div>
                ) : <span className="text-sm">Reset Password</span>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      <main className="flex-grow flex w-full bg-white relative overflow-hidden">
        {/* Left Side: Image/Branding (Visible on lg+) */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-50 flex-col items-center justify-center p-16 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="relative z-10 w-full max-lg animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-4 leading-tight">
                Secure Your <span className="text-zinc-500">Business Profile</span>
              </h2>
              <p className="text-base text-zinc-500 font-medium max-w-md">
                Reset your password to keep your business orders and custom designs secure.
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
                 <span className="text-zinc-900 font-bold text-lg leading-tight">Secure Access</span>
                 <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Protected Profile</span>
               </div>
               <div className="w-px h-6 bg-zinc-200"></div>
               <div className="flex flex-col">
                 <span className="text-zinc-900 font-bold text-lg leading-tight">Cloud Sync</span>
                 <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Design Backup</span>
               </div>
            </div>
          </div>

          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-zinc-200/50 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-zinc-100/50 rounded-full blur-[100px]"></div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 bg-white relative">
          <div className="absolute inset-0 lg:hidden opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          
          <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
            {/* Logo above form */}
            <Link to="/" className="mb-6 hover:opacity-80 transition-opacity">
              <img src={Logo} alt="PrintifyX Logo" className="h-16 w-auto" />
            </Link>
            
            {renderCard()}

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
  );
};

export default ForgotPassword;

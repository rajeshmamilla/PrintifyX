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
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, sendRegisterOtp, verifyOtp } from "../services/api";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

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
    <div className="flex gap-2 justify-center">
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
            "w-11 h-12 text-center text-lg font-bold rounded-md border border-input bg-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
            "transition-all",
            digit ? "border-zinc-900 bg-zinc-50" : "border-gray-200"
          )}
        />
      ))}
    </div>
  );
}

// ── Register Form ──────────────────────────────────────────────────────────────
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
  useState(() => {
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
  });

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
      // 1. Verify OTP first
      await verifyOtp(email, code, "REGISTRATION");
      
      // 2. If verified, proceed with actual registration
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
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We've sent a 6-digit OTP to{" "}
              <span className="font-semibold text-zinc-900">{email}</span>.{" "}
              <button
                type="button"
                className="text-zinc-500 underline underline-offset-4 hover:text-zinc-900 text-sm"
                onClick={() => { setStep("form"); setOtp(Array(6).fill("")); setOtpError(""); }}
              >
                Change
              </button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOtp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label className="text-center text-sm text-muted-foreground">
                    Enter the 6-digit code
                  </Label>
                  <OtpInput value={otp} onChange={setOtp} />
                </div>

                {otpError && (
                  <p className="text-sm text-red-500 font-medium text-center">{otpError}</p>
                )}

                <Button
                  type="submit"
                  disabled={otpLoading}
                  className="w-full h-10 font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-50 shadow-sm border border-transparent"
                >
                  {otpLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    disabled={resendDisabled}
                    onClick={handleResendOtp}
                    className={cn(
                      "font-medium underline underline-offset-4",
                      resendDisabled
                        ? "text-gray-400 cursor-not-allowed no-underline"
                        : "text-zinc-900 hover:text-zinc-700"
                    )}
                  >
                    Resend OTP {resendDisabled && `(${timer}s)`}
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── Registration form UI ──
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your information below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">

              {/* Full Name */}
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="h-10 px-3 py-2 text-sm"
                />
              </div>

              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 px-3 py-2 text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  We'll use this to contact you. We will not share your email with anyone else.
                </p>
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 px-3 py-2 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 8 characters long.
                </p>
              </div>

              {/* Confirm Password */}
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-10 px-3 py-2 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Please confirm your password.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-50 shadow-sm border border-transparent"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-10 font-medium"
                onClick={() => window.location.href = "http://localhost:8081/oauth2/authorization/google"}
              >
                Sign up with Google
              </Button>
            </div>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4 hover:text-zinc-900 font-medium">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

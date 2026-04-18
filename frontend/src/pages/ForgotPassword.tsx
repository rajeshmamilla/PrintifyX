import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

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

  // ── Step 1: send OTP ──
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    // TODO: call real API — POST /auth/forgot-password {email}
    setTimeout(() => {
      setEmailLoading(false);
      setStep("otp");
      setResendDisabled(true);
      setTimeout(() => setResendDisabled(false), 30_000);
    }, 800);
  };

  // ── Step 2: verify OTP ──
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }
    setOtpLoading(true);
    // TODO: call real API — POST /auth/verify-otp {email, otp}
    setTimeout(() => {
      setOtpLoading(false);
      setStep("reset");
    }, 800);
  };

  const handleResendOtp = () => {
    setOtp(Array(6).fill(""));
    setOtpError("");
    setResendDisabled(true);
    // TODO: call real API to resend OTP
    setTimeout(() => setResendDisabled(false), 30_000);
  };

  // ── Step 3: reset password ──
  const handleReset = (e: React.FormEvent) => {
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
    // TODO: call real API — POST /auth/reset-password {email, otp, newPassword}
    setTimeout(() => {
      setResetLoading(false);
      setResetDone(true);
    }, 800);
  };

  // ── Card Content by step ──
  const renderCard = () => {
    // ── SUCCESS ──
    if (resetDone) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Password reset!</CardTitle>
            <CardDescription>
              Your password has been updated successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              <p className="text-sm text-muted-foreground text-center">
                You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="flex items-center justify-center w-full h-10 rounded-md font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-50 text-sm transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      );
    }

    // ── STEP 1: Email ──
    if (step === "email") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot password?</CardTitle>
            <CardDescription>
              Enter your registered email and we'll send you a verification code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendOtp}>
              <div className="flex flex-col gap-6">
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
                </div>

                <Button
                  type="submit"
                  disabled={emailLoading}
                  className="w-full h-10 font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-50 shadow-sm"
                >
                  {emailLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </div>

              <div className="mt-4 text-center text-sm">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-zinc-900 font-medium underline underline-offset-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    }

    // ── STEP 2: OTP ──
    if (step === "otp") {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Enter verification code</CardTitle>
            <CardDescription>
              We sent a 6-digit OTP to{" "}
              <span className="font-semibold text-zinc-900">{email}</span>.{" "}
              <button
                type="button"
                className="text-zinc-500 underline underline-offset-4 hover:text-zinc-900 text-sm"
                onClick={() => { setStep("email"); setOtp(Array(6).fill("")); setOtpError(""); }}
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
                  className="w-full h-10 font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-50 shadow-sm"
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
                    Resend OTP
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      );
    }

    // ── STEP 3: New Password ──
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Set new password</CardTitle>
          <CardDescription>
            Choose a strong password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReset}>
            <div className="flex flex-col gap-5">

              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-10 px-3 py-2 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Must be at least 8 characters long.</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-10 px-3 py-2 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Please confirm your password.</p>
              </div>

              {resetError && (
                <p className="text-sm text-red-500 font-medium text-center">{resetError}</p>
              )}

              <Button
                type="submit"
                disabled={resetLoading}
                className="w-full h-10 font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-50 shadow-sm"
              >
                {resetLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-6 md:p-10 bg-gray-50/50">
        <div className="w-full max-w-sm">
          {renderCard()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword;

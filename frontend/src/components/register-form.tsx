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
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
        const data = await registerUser(email, password);
        console.log("Registration success:", data);
        setSuccess(true);
        alert("Registration Successful");
        navigate("/login");
    } catch (err: any) {
        setError(err.message || "Registration failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="h-10 px-3 py-2 text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-medium text-center">{error}</p>
              )}
               {success && (
                <p className="text-sm text-green-500 font-medium text-center">Registration successful!</p>
              )}

              <Button type="submit" disabled={loading} className="w-full h-10 font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-50 shadow-sm border border-transparent">
                {loading ? "Registering..." : "Sign up"}
              </Button>
              <Button type="button" variant="outline" className="w-full h-10 font-medium" onClick={() => alert('Google signup coming soon!')}>
                Sign up with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4 hover:text-zinc-900 font-medium">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

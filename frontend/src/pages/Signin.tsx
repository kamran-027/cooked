import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "../lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";
import { BackgroundBeams } from "@/components/ui/background-beams";
import AppLogo from "@/assets/Cooked_Logo.png";
import { Eye, EyeOff } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const signInUser = async () => {
    const res = await api.post(`/user/login`, {
      email,
      password,
    });
    return res.data;
  };

  const { mutate: handleUserSubmit, isPending } = useMutation({
    mutationKey: ["signin"],
    mutationFn: signInUser,
    onSuccess(response) {
      sessionStorage.setItem("token", response.token);
      setUser(response.user);
      toast.success("Welcome back.");
      navigate("/dashboard");
    },
    onError(error: any) {
      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Error Signing In! Please check details again",
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleUserSubmit();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
      <BackgroundBeams className="opacity-45" />

      <div className="relative z-10 grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl lg:grid-cols-2">
        <div className="hidden border-r border-border/70 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3">
              <img src={AppLogo} alt="Cooked Logo" className="h-14 w-14 rounded-xl border border-border/70" />
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Cooked</h1>
                <p className="text-sm text-muted-foreground">Sophisticated chef booking</p>
              </div>
            </div>
            <p className="mt-8 max-w-md text-sm leading-6 text-muted-foreground">
              Discover trusted chefs, book in minutes, and enjoy premium home dining without the hassle.
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Verified cook profiles</p>
            <p>• Transparent hourly rates</p>
            <p>• Fast and secure booking flow</p>
          </div>
        </div>

        <div className="w-full p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <img src={AppLogo} alt="Cooked Logo" className="h-11 w-11 rounded-lg border border-border/70" />
            <div>
              <h2 className="text-xl font-semibold">Cooked</h2>
              <p className="text-xs text-muted-foreground">Sophisticated chef booking</p>
            </div>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Sign In</h2>
          <p className="mt-1 text-sm text-muted-foreground">Get back to your kitchen dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="sam.cook@cooked.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 py-1 select-none">
              <input
                id="sample-credentials"
                type="checkbox"
                checked={email === "d.rice@arsenal.com" && password === "ricericebaby"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setEmail("d.rice@arsenal.com");
                    setPassword("ricericebaby");
                  } else {
                    setEmail("");
                    setPassword("");
                  }
                }}
                className="h-4 w-4 rounded-2xl border-border bg-background text-primary focus:ring-ring cursor-pointer"
              />
              <label htmlFor="sample-credentials" className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Use Sample Credentials (d.rice@arsenal.com)
              </label>
            </div>
            <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

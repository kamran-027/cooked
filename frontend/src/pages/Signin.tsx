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

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <BackgroundBeams className="opacity-40" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border/70 bg-card p-8 shadow-xl backdrop-blur-sm">
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
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
  );
};

export default SignIn;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "@/lib/axios";
import { BackgroundBeams } from "@/components/ui/background-beams";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUpUser = async () => {
    const res = await api.post(`/user/signup`, {
      name,
      email,
      password,
    });
    return res.data;
  };

  const { mutate: handleUserSubmit, isPending } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signUpUser,
    onSuccess() {
      toast.success("User Signed Up Successfully!");
      navigate("/signin");
    },
    onError(error: any) {
      toast.error(error?.response?.data?.message || "Error Signing Up!");
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
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">Create Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Join Cooked and start booking in minutes.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="sam.cook@cooked.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full cursor-pointer" disabled={isPending}>
            {isPending ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

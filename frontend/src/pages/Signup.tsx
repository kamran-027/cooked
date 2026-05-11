import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "@/lib/axios";
import { BackgroundBeams } from "@/components/ui/background-beams";
import AppLogo from "@/assets/Cooked_Logo.png";

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
              Create your account and unlock a curated network of chefs tailored to your lifestyle and taste.
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Personalized chef discovery</p>
            <p>• Streamlined booking management</p>
            <p>• Elegant, mobile-first experience</p>
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
    </div>
  );
};

export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const baseAPIUrl = import.meta.env.VITE_BASE_API_URL;

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const signUpUser = async () => {
    const res = await axios.post(`${baseAPIUrl}/user/signup`, {
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
    onError() {
      toast.error("Error Signing Up!");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleUserSubmit();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          Are You Ready to be Cooked ?
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="focus-visible:ring-2 focus-visible:ring-yellow-300"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="focus-visible:ring-2 focus-visible:ring-yellow-300"
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
              className="focus-visible:ring-2 focus-visible:ring-yellow-300"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-yellow-300 hover:bg-yellow-400 cursor-pointer mt-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
            variant={"outline"}
            disabled={isPending}
          >
            Sign Up
            {isPending && <span className="ml-2 animate-spin">🔄</span>}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

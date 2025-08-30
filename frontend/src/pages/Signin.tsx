import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import api from "../lib/axios";
import { useMutation } from "@tanstack/react-query";

import { useUser } from "../contexts/UserContext";

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

  const { mutate: handleUserSubmit } = useMutation({
    mutationKey: ["signin"],
    mutationFn: signInUser,
    onSuccess(response) {
      sessionStorage.setItem("token", response.token);
      setUser(response.user);

      toast.success("Login Successful!");
      navigate("/dashboard");
    },
    onError() {
      toast.error("Error Signing In! Please check details again");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleUserSubmit();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Let's Cook</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="sam.cook@cooked.com"
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
            variant={"outline"}
            className="w-full  bg-yellow-300 hover:bg-yellow-400 cursor-pointer mt-2 focus-visible:ring-2 focus-visible:ring-yellow-300"
          >
            Sign In
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

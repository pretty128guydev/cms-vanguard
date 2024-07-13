"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useAuthContext } from "@/context/auth-provider";
import LoadingScreen from "../shared/Loader";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isUserLoggedIn, Login, Logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (isUserLoggedIn) {
      router.push("/claims");
    }
  }, [isUserLoggedIn, router]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await Login(email, password);
      // router.push("/claims");
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Logout();
    // Implement forgot password logic
  };

  if (isLoading) {
    return <LoadingScreen showLabel={true} label="Logging in..." />;
  }

  return (
    <div className="max-w-md w-[90%] mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <Image
          src="/icons/logo2019.png"
          alt="FlowBite Logo"
          width={250}
          height={50}
        />
      </div>

      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            type="email"
            id="email"
            required
            placeholder="Email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
            value={email}
            onChange={handleEmailChange}
            aria-label="Email"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
            value={password}
            onChange={handlePasswordChange}
            aria-label="Password"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <Button type="submit">
            Sign in
          </Button>
          <Link
            className="text-sm text-neutral-500 hover:text-neutral-700 focus:outline-none"
            href="/forget-password"
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

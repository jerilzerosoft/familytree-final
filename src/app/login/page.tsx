"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Email from "@/assets/images/mail-icon.png";
import Password from "@/assets/images/password-icon.png";



const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://api.familytreee.zerosoft.in/admin/login/",{
      // const response = await fetch("http://localhost:8000/admin/login/", {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.user.id); 
        localStorage.setItem("userEmail", data.user.email); 
        localStorage.setItem("username", data.user.username); 

        router.push("/");
      } else {
        setError(data.detail || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen banner-images login-banner">
      <div
        className="p-8 rounded-lg shadow-lg mx-auto backdrop-blur-md w-full max-w-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-gray-600 cursor-pointer hover:text-black transition"
          >
            ← Back
          </button>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 text-sm py-2">
          Sign in to explore your family members and connect with loved ones.
        </p>

        {error && (
          <p className="text-red-600 text-sm text-center mb-2">{error}</p>
        )}

        <form onSubmit={handleLogin} className="mt-4 space-y-4">
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 pl-10 border border-[rgba(0,0,0,0.3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                placeholder="you@example.com"
                required
              />
              <Image
                src={Email}
                alt="Email"
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pl-10 border border-[rgba(0,0,0,0.3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                placeholder="********"
                required
              />
              <Image
                src={Password}
                alt="Password"
                className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="inline-block cursor-pointer bg-[#EEEA0F] hover:bg-yellow-500 text-black py-3 px-6 rounded-full transition duration-300"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

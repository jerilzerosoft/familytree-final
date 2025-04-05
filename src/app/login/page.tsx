"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import Email from "@/assets/images/mail-icon.png";
import Password from "@/assets/images/password-icon.png";

const Login = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen banner-images login-banner">
      {/* Login Form */}
     
      <div
        className="p-8 rounded-lg shadow-lg mx-auto backdrop-blur-md w-full max-w-md"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
      >
         <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-gray-600 hover:text-black transition"
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

        <form className="mt-4 space-y-4">
          <div className="relative">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                className="w-full p-2 pl-10 border border-[rgba(0,0,0,0.3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                placeholder="you@example.com"
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
                className="w-full p-2 pl-10 border border-[rgba(0,0,0,0.3)] rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
                placeholder="********"
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
              className="inline-block bg-[#EEEA0F] hover:bg-yellow-500 text-black py-3 px-6 rounded-full transition duration-300"
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

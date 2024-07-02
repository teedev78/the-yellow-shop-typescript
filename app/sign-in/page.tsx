"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa6";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result: any = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        console.error(result.error);
        setError(result.error);
      } else {
        router.push("/profile");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md border-2 border-gray-100 w-[500px]">
        <h1 className="flex justify-center items-center font-semibold text-2xl mb-2">
          Sign In
        </h1>
        <form onSubmit={handleSubmit} className="">
          <div className="mt-4 h-20">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-8 border border-gray-300 px-3 py-2 rounded"
            />
          </div>
          <div className="mt-2 h-20">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-8 border border-gray-300 px-3 py-2 rounded"
            />
          </div>
          {error !== "" && <span className="text-red-600 mb-1">{error}</span>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded my-4"
          >
            Sign In
          </button>
        </form>
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="ml-1 hover:underline text-blue-500"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="text-center mb-2">or</div>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded mb-5"
        >
          <FaGoogle />
          Sign in with Google
        </button>
        <div className="flex justify-end items-center">
          no Account? go
          <Link href="/sign-up" className="mx-1 hover:underline text-blue-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

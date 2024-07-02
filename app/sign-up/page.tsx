"use client";

import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa6";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [error, setError] = useState("");

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      e.target.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) ||
      e.target.value === ""
    ) {
      setEmailError("");
    } else {
      setEmailError("email adress not valid.");
    }
    setEmail(e.target.value);
  };

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 3) {
      setNameError("name should be at least 3 characters long.");
    } else {
      setNameError("");
    }
    setName(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length < 8) {
      setPasswordError("password should be at least 8 characters long.");
    } else {
      setPasswordError("");
    }
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      setEmailError("email adress not valid.");
      return;
    }
    if (name.length < 3) {
      setNameError("name should be at least 3 characters long.");
      return;
    }
    if (password.length < 8) {
      setPasswordError("password should be at least 8 characters long.");
      return;
    }

    await axios
      .post("/api/auth/signup", {
        email,
        name,
        password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.status !== 201) {
          setError(res.data.message);
          return;
        }
        router.push("/profile");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-md border-2 border-gray-100 w-[500px]">
        <h1 className="flex justify-center items-center font-semibold text-2xl mb-2">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="">
          <div className="mt-4 h-20">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmail(e)}
              required
              className="w-full h-8 border border-gray-300 px-3 py-2 rounded"
            />
            {emailError !== "" && (
              <span className="text-red-600 h-4">{emailError}</span>
            )}
          </div>
          <div></div>
          <div className="mt-2 h-20">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => handleName(e)}
              required
              pattern="^[A-Za-z]{3,20}$"
              className="w-full h-8 border border-gray-300 px-3 py-2 rounded"
            />
            {nameError !== "" && (
              <span className="text-red-600 h-4">{nameError}</span>
            )}
          </div>
          <div className="mt-2 h-20">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => handlePassword(e)}
              required
              className="w-full h-8 border border-gray-300 px-3 py-2 rounded"
            />
            {passwordError !== "" && (
              <span className="text-red-600">{passwordError}</span>
            )}
          </div>
          {error !== "" && <div className="text-red-600 mb-1">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded my-4"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mb-2">or</div>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded mb-5"
        >
          <FaGoogle />
          Sign up with Google
        </button>
        <div className="flex justify-end items-center">
          want to
          <Link href="/sign-in" className="mx-1 hover:underline text-blue-500">
            Sign in
          </Link>
          instead.
        </div>
      </div>
    </div>
  );
};

export default SignUp;

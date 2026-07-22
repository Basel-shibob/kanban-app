"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "../../../lib/api";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(name, email, password);
      router.push("/login");
    } catch (error) {
      console.error("Error registering", error);
      setError("Failed to register");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-lg font-semibold text-text text-center mb-1">
            Create account
          </h1>
          <p className="text-sm text-muted text-center mb-6">
            Get started with your boards
          </p>
          <form
            onSubmit={handleSubmit}
            className="bg-surface border border-border rounded-[10px] p-6 flex flex-col gap-3"
          >
            <input
              name="name"
              placeholder="Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-surface-2 border border-border focus:border-accent focus:ring-1 focus:ring-accent text-text placeholder:text-faint text-sm px-3 py-2 rounded-[7px] outline-none
  transition-colors"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-2 border border-border focus:border-accent focus:ring-1 focus:ring-accent text-text placeholder:text-faint text-sm px-3 py-2 rounded-[7px] outline-none
  transition-colors"
            />
            <input
              type="password"
              name="password"
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-surface-2 border border-border focus:border-accent focus:ring-1 focus:ring-accent text-text placeholder:text-faint text-sm px-3 py-2 rounded-[7px] outline-none
  transition-colors"
            />
            {error && <p className="text-danger text-xs">{error}</p>}
            <button
              className="bg-accent hover:bg-[#6872e5] text-white text-sm font-medium py-2 rounded-[7px] transition-colors mt-1"
              type="submit"
            >
              Create account
            </button>
          </form>
          <p className="text-sm text-muted text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "@/lib/api";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.userToken);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error login", error);
      setError("Failed to login");
    }
  };
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="w-full max-w-sm">
          <h1 className="text-lg font-semibold text-text text-center mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted text-center mb-6">
            Sign in to your account
          </p>
          <form
            onSubmit={handleLogin}
            className="bg-surface border border-border rounded-[10px] p-6 flex flex-col gap-3"
          >
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
              type="submit"
              className="bg-accent hover:bg-[#6872e5] text-white text-sm font-medium py-2 rounded-[7px] transition-colors mt-1"
            >
              Sign in
            </button>
          </form>
          <p className="text-sm text-muted text-center mt-4">
            No account?{" "}
            <Link href="/register" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

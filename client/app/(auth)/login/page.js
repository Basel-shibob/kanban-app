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
        localStorage.setItem('token', data.userToken);
        router.push('/dashboard')
    } catch (error) {
      console.error("Error login", error);
      setError("Faild to login");
    }
  };
  return (
    <>
        <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">Submit</button>
        </form>
        <Link href="/register">sigin</Link>
    </>
  )
}

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
      setError("Faild to register");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
      <Link href="/login">login</Link>
    </>
  );
}

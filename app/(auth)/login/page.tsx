"use client";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
      try {
        console.log("Sending:", { email, password }); // 🔥 ADD THIS

        const res = await api.post("/auth/login/", {
          email: email.trim(),
          password: password.trim(),
        });

        console.log("Response:", res.data); // 🔥 ADD THIS

        localStorage.setItem("token", res.data.access);
        router.push("/dashboard");

      } catch (err: any) {
        console.log("ERROR:", err.response?.data); // 🔥 VERY IMPORTANT
        alert(err.response?.data?.error || "Login failed");
      }
    };

    useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="button" onClick={handleLogin}>
          Login
        </button>

      </div>
    </div>
  );
}
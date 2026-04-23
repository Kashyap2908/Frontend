"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    branch_name: "",
    branch_location: "",
    name: "",
    user_name: "",
    email: "",
    password: "",
    role: "ADMIN"
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleRegister = async () => {
    try {
      await api.post("/auth/register/", form);
      alert("Registered successfully");
      router.push("/login");
    } catch (err: any) {
    const message = err.response?.data?.error;

    if (message === "User already exists") {
        alert("Email already registered. Please login.");
    } else {
        alert("Something went wrong");
    }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        <input className="input" placeholder="Branch Name" onChange={(e) => handleChange("branch_name", e.target.value)} />
        <input className="input" placeholder="Branch Location" onChange={(e) => handleChange("branch_location", e.target.value)} />
        <input className="input" placeholder="Full Name" onChange={(e) => handleChange("name", e.target.value)} />
        <input className="input" placeholder="Username" onChange={(e) => handleChange("user_name", e.target.value)} />
        <input className="input" placeholder="Email" onChange={(e) => handleChange("email", e.target.value)} />
        <input className="input" type="password" placeholder="Password" onChange={(e) => handleChange("password", e.target.value)} />

        <select className="input" onChange={(e) => handleChange("role", e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="CASHIER">Cashier</option>
        </select>

        <button className="button" onClick={handleRegister}>
          Register
        </button>
        <p style={{ marginTop: 10 }}>
        Already have an account?{" "}
        <span className="link" onClick={() => router.push("/login")}>
            Login
        </span>
        </p>
      </div>
    </div>
  );
}
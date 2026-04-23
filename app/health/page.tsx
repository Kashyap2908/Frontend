"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HealthPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard</h1>

      <div style={{
        marginTop: 20,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px"
      }}>
        <div style={cardStyle}>Total Sales</div>
        <div style={cardStyle}>Stock Summary</div>
        <div style={cardStyle}>Cash Balance</div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
};
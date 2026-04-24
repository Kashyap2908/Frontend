"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setIsReady(true);
    }
  }, []);

  if (!isReady) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* 🔷 SIDEBAR */}
      <div
        style={{
          width: "220px",
          background: "#1e293b",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>ERP</h2>

        <p onClick={() => router.push("/dashboard")} style={{ cursor: "pointer" }}>
          Dashboard
        </p>

        <p style={{ cursor: "pointer" }}>Products</p>
        <p style={{ cursor: "pointer" }}>Billing</p>
        <p style={{ cursor: "pointer" }}>Reports</p>

        <button
          style={{
            marginTop: "20px",
            padding: "8px",
            background: "#ef4444",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          onClick={() => {
            localStorage.removeItem("token");
            router.replace("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔷 MAIN CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        {children}
      </div>
    </div>
  );
}
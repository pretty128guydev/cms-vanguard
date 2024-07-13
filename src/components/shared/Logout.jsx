"use client";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Logout = () => {
  const { isUserLoggedIn, Logout } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoggedIn) {
      router.push("/login");
    }
  }, [isUserLoggedIn, router]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      Logout();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
    >
      Logout
    </button>
  );
};

export default Logout;

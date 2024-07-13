"use client"
import Login from "@/components/auth/Login";
import LoadingScreen from "@/components/shared/Loader";
import { useAuthContext } from "@/context/auth-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";


const LoginPage = () => {
  const { isUserLoggedIn, isLoading } = useAuthContext();
  const router = useRouter();
  // console.log(isUserLoggedIn, isLoading);
  if (isUserLoggedIn) {
    router.push("/claims");
    router.refresh();
  } else
    return !isLoading ? (
      <div className="min-h-screen bg-pattern bg-cover bg-no-repeat gap-6 flex flex-col items-center justify-center">
        <Login />
      </div>
    ) : (
      <LoadingScreen showLabel={true} label="Checking user status" />
    );
};

export default LoginPage;

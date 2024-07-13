"use client"
import ClaimCreateWrapper from "@/app/_components/claims/ClaimCreateWrapper";
import ProtectRoute from "@/components/shared/ProtectRoute";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/Loader";
import React from "react";

const Create = () => {
  const { isUserLoggedIn, isLoading } = useAuthContext();
  const router = useRouter();
  if (!isUserLoggedIn) {
    router.push("/login");
  } else {
    return !isLoading ? (
      <ProtectRoute enableAuthorization={true}>
        <ClaimCreateWrapper type="create" />
      </ProtectRoute>
    ):(
      <LoadingScreen showLabel={true} label="Checking user status" />
    )
  }
};

export default Create;

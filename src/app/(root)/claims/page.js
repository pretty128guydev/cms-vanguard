"use client";
import { ClaimTable } from "@/app/_components/claims/Table/ClaimTable";
import { columns } from "@/app/_components/claims/Table/Columns";
import useCurrentAdjusterClaims from "@/hooks/useCurrentAdjusterClaims";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/Loader";
import React from "react";

const Claims = () => {
  const {
    isUserLoggedIn,
    isLoading,
    isAdjuster,
    isAdmin,
    isSuperAdmin,
    userLoading,
  } = useAuthContext();
  const [currentAdjusterClaims, loading] = useCurrentAdjusterClaims();
  const router = useRouter();
  
  if (!isUserLoggedIn) {
    router.push("/login");
  } else {
    return !isLoading ? (
      <div className="md:px-6 px-2 mx-auto">
        <ClaimTable
          tableDataLoading={loading}
          columns={columns(isAdjuster, isAdmin, isSuperAdmin)}
          data={currentAdjusterClaims}
        />
      </div>
    ) : (
      <LoadingScreen showLabel={true} label="Checking user status" />
    );
  }
};

export default Claims;

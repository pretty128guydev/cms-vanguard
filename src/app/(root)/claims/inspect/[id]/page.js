"use client"
import InspectionCreateWrapper from "@/app/_components/inspections/InspectionCreateWrapper";
import { database } from "@/cms/cms.config";
import LoadingScreen from "@/components/shared/Loader";
import Loading from "@/components/shared/Loading";
import AdjusterNavigationProvider from "@/context/adjusterNavigation-provider";
import InspectionDataProvider from "@/context/inspectionData-provider";
import InspectionFormProvider from "@/context/inspectionForm-provider";
import useIsCurrentAdjusterClaim from "@/hooks/useIsCurrentAdjusterClaim";
import { ID } from "appwrite";
import { useParams } from "next/navigation";
import React,{useEffect} from "react";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";

const Inspection = () => {
  const params = useParams();
  const {isCurrentAdjusterClaim, loading} = useIsCurrentAdjusterClaim(params?.id);
  // console.log("isCurrentAdjusterClaim", isCurrentAdjusterClaim);
  const {currentUser, isUserLoggedIn, isLoading: isAuthLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isUserLoggedIn) {
      router.push("/login");
    }
  }, [isAuthLoading, isUserLoggedIn, router]);

  if(loading){
    return <LoadingScreen />
  }
  else if(!isCurrentAdjusterClaim){
    return(
      <div className="text-red-600 p-4">
        <p>You are not authorized to view this inspection</p>
      </div>
    )
  }
  else return (
    !loading && isCurrentAdjusterClaim ? <div>
        <InspectionDataProvider>
          <InspectionFormProvider>
            <InspectionCreateWrapper currentUser={currentUser}/>
          </InspectionFormProvider>
        </InspectionDataProvider>
    </div> : null
  );
};

export default Inspection;

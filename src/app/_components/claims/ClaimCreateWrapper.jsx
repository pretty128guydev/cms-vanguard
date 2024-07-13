"use client";
import AdminClaimLinks from "@/components/shared/AdminClaimLinks";
import Menubar from "@/components/shared/Menubar";
import React, { useEffect, useState } from "react";
import ClaimForm from "./ClaimForm";
import ClaimFormProvider, {
  useClaimFormContext,
} from "@/context/claimform-provider";
import { useRouter } from "next/navigation";
import { useMultiStepContext } from "@/context/multistep-provider";
import Loading from "@/components/shared/Loading";
const ClaimCreateWrapper = ({ type }) => {
  const {
    watchingvalues: { peril },
    getValues,
  } = useClaimFormContext({ type });
  const router = useRouter();
  const { step, onStepClick } = useMultiStepContext();
  const [steps, setSteps] = useState([
    "Welcome",
    "Loss",
    "Risk",
    "Cause of Loss",
    "Damages",
    "PSEs",
    "Assignment",
    "Success",
  ]);


  useEffect(() => {
    let perilName = getValues("peril") || "";
    perilName = perilName.replace(/Loss/g, "");
    setSteps([
      "Welcome",
      `${perilName} ${perilName && "-"} Loss`,
      `${perilName} ${perilName && "-"} Risk`,
      `${perilName} ${perilName && "-"} Cause of Loss`,
      `${perilName} ${perilName && "-"} Damages`,
      "PSEs",
      "Assignment",
      "Success",
    ]);
  }, [peril, getValues]);
  return (
    <div className="flex">
      <Menubar>
        <AdminClaimLinks
          step={step}
          onStepClick={onStepClick}
          steps={steps}
          className="mt-4 fixed"
        />
      </Menubar>
      <ClaimForm />
    </div>
  );
};

export default ClaimCreateWrapper;

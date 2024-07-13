"use client";
import AdminClaimLinks from "@/components/shared/AdminClaimLinks";
import Menubar from "@/components/shared/Menubar";
import React, { useEffect, useState } from "react";
import InspectionForm from "./InspectionForm";
import { useAdjusterNavigationContext } from "@/context/adjusterNavigation-provider";
const InspectionCreateWrapper = ({currentUser}) => {
  const {step, onStepClick} = useAdjusterNavigationContext();
  const [steps, setSteps] = useState([
    "Inspection",
    "Risk",
    "Cause of Loss",
    "Damages",
    "PSEs",
    "Coverage",
    "Other Tasks",
  ]);

  useEffect(() => {
    
  }, []);
  
    return (
      <div className="flex">
        <Menubar>
          <AdminClaimLinks step={step} onStepClick={onStepClick} steps={steps} className="mt-4 fixed" />
        </Menubar>
        <InspectionForm currentUser={currentUser} />
      </div>
    );
};

export default InspectionCreateWrapper;

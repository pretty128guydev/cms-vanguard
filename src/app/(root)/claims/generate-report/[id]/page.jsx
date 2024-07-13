"use client";
import AdminClaimLinks from "@/components/shared/AdminClaimLinks";
import Menubar from "@/components/shared/Menubar";
import React, { useState } from "react";
import { useAdjusterNavigationContext } from "@/context/adjusterNavigation-provider";
import ReportUploadForm from "@/components/shared/ReportUploadForm";
const Page = ({ params }) => {
  const { step, onStepClick } = useAdjusterNavigationContext();
  const [steps, setSteps] = useState(["Report Upload"]);

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
      <ReportUploadForm params={params}/>
      </div>
  );
};

export default Page;

"use client";
import { useMultiStepContext } from "@/context/multistep-provider";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useClaimFormContext } from "@/context/claimform-provider";

const AdminClaimLinks = ({ className, steps, step, onStepClick }) => {
  const { watch, allErrors } = useClaimFormContext();
  const [navigationGroupsWithErrors, setNavigationGroupsWithErrors] = useState([]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Extract unique error groups from allErrors
    const errorGroups = Array.from(
      new Set(allErrors.map((error) => error.NavigationGroup))
    );
    setNavigationGroupsWithErrors(errorGroups);
  }, [allErrors, watch]);

  function titleCaseWithOutSpace(str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    // Directly return the joined string
    return splitStr.join(' '); 
 }

  return (
    <div className={cn("space-y-2 font-medium mt-8", className)}>
      {steps.map((name, index) => {
     // Split the step name and trim spaces
     const stepParts = name.split('-').map(part => part.trim());
     const stepCategory = stepParts.length > 1 ? stepParts[1] : stepParts[0];
     // Check if stepCategory contains any of the error groups
    //  const isError = navigationGroupsWithErrors.some(errorGroup => stepCategory.includes(errorGroup));
     const isError = navigationGroupsWithErrors.includes(titleCaseWithOutSpace(stepCategory).replace(/[ ]+/g, ""));
        return (
          <React.Fragment key={index}>
            <div className="relative">
              <button
                className={cn(
                  "flex items-center p-2 hover:text-neutral-950 transition-all ease-in-out duration-150 rounded-lg group",
                  {
                    "text-black font-semibold": step === index + 1,
                    "text-neutral-500": step !== index + 1,
                    "text-red-500": isError, // Highlight step if it has an error
                  }
                )}
                onClick={() => {
                  scrollToTop();
                  onStepClick(index + 1);
                }}
              >
                <span
                  className={cn(
                    "relative rounded-full p-3 w-6 h-6 flex items-center justify-center mr-2",
                    {
                      "bg-neutral-800 text-white font-bold": step === index + 1,
                      "bg-neutral-200 opacity-90 text-black font-semibold": step !== index + 1,
                      "bg-red-500 text-white": isError, // Highlight circle if it has an error
                    }
                  )}
                >
                  {index + 1}
                </span>
                {name}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`w-px border ${
                    step >= index + 2 ? "border-solid" : "border-dashed"
                  } border-neutral-900 h-7 absolute top-8 left-5`}
                />
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default AdminClaimLinks;

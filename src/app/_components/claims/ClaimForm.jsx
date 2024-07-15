"use client";
import React, { useState } from "react";
import Welcome from "./Forms/Welcome";
import { Button } from "@/components/ui/button";
import Loss from "./Forms/Loss";
import CauseOfLoss from "./Forms/CauseOfLoss";
import Risk from "./Forms/Risk";
import Damage from "./Forms/Damages";
import Pse from "./Forms/Pse";
import Assignment from "./Forms/Assignment";
import { useClaimFormContext } from "@/context/claimform-provider";
import { useMultiStepContext } from "@/context/multistep-provider";
import SuccessCard from "@/components/shared/Success";
import { VscDebugRestart } from "react-icons/vsc";

const ClaimForm = () => {
  const { handleSubmit, onSubmit, isSubmitting } = useClaimFormContext();
  const { nextStep, prevStep, step, setStep } = useMultiStepContext();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStep = () => {
    nextStep();
    scrollToTop();
  };

  const handlePrevStep = () => {
    prevStep();
    scrollToTop();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl w-full px-6 py-8 mx-auto"
    >
      <div>
        {step === 1 && <Welcome />}
        {step === 2 && <Loss />}
        {step === 3 && <Risk />}
        {step === 4 && <CauseOfLoss />}
        {step === 5 && <Damage />}
        {step === 6 && <Pse />}
        {step === 7 && <Assignment />}
        {step === 8 && (
          <div className="">
            <div className="flex items-center justify-end">
              <Button onClick={() => setStep(1)} type="button">
                Restart <VscDebugRestart className="ml-2" />
              </Button>
            </div>
            <div className="h-96 flex flex-col items-center justify-center">
              <SuccessCard />
            </div>
          </div>
        )}
        <div className="flex items-center justify-between py-4">
          {step !== 8 && (
            <Button
              type="button"
              onClick={handlePrevStep}
              disabled={step === 1}
            >
              Prev
            </Button>
          )}
          {step !== 7 && step !== 8 && (
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={step === 8}
            >
              Next
            </Button>
          )}
          {step === 7 && (
            <Button type="submit" disabled={isSubmitting}>
              Submit {isSubmitting && <div className="loader w-8"></div>}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ClaimForm;

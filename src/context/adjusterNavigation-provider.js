"use client";


const { createContext, useContext, useState } = require("react");

const AdjusterNavigationContext = createContext({});

export const useAdjusterNavigationContext = () => {
  return useContext(AdjusterNavigationContext);
};

const AdjusterNavigationProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const prevStep = () => {
    setStep(step - 1);
  };
  const nextStep = () => {
    setStep(step + 1);
  };
  const onStepClick = (stepNum) => {
    setStep(stepNum);
  };
  const ctxValue = {
    prevStep,
    nextStep,
    onStepClick,
    step,
    setStep
  };
  return (
    <AdjusterNavigationContext.Provider value={ctxValue}>
      {children}
    </AdjusterNavigationContext.Provider>
  );
};

export default AdjusterNavigationProvider;

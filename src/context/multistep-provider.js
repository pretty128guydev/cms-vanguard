"use client";


const { createContext, useContext, useState } = require("react");

const MultiStepContext = createContext({});

export const useMultiStepContext = () => {
  return useContext(MultiStepContext);
};

const MultiStepProvider = ({ children }) => {
  const [step, setStep] = useState(1);
  const prevStep = () => {
    setStep(step - 1);
  };
  const nextStep = () => {
    setStep(step + 1);
  };
  const onStepClick = (stepNum) => {
    stepNum < 8 && setStep(stepNum);
  };
  const ctxValue = {
    prevStep,
    nextStep,
    onStepClick,
    step,
    setStep
  };
  return (
    <MultiStepContext.Provider value={ctxValue}>
      {children}
    </MultiStepContext.Provider>
  );
};

export default MultiStepProvider;

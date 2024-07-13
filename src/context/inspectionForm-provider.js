"use client";
const { createContext, useContext, useState } = require("react");
import { useForm } from "react-hook-form";
import { useClaimDataContext } from "./claimData-provider";
import { toast } from "@/components/ui/use-toast";
import { CreateDocument } from "@/cms/DatabaseHelpers/database-helper";
import { useMultiStepContext } from "./multistep-provider";

const InspectionFormContext = createContext({});

export const useInspectionFormContext = () => {
  return useContext(InspectionFormContext);
};

const InspectionFormProvider = ({ children }) => {
//   const {data:formQuestions} = useClaimDataContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    trigger,
    getValues,
    watch,
    reset
  } = useForm({});
  const watchAllFields = watch();
//   const onSubmit = async(data) => {
//     let isValidForm;
//     let formQ = formQuestions.filter(p=>p.Required === true)
//     for(let i=0;i<formQ.length;i=i+1){
//       const name = formQ[i].FieldName
//       if(!data[name] || data[name]?.length === 0){
//         isValidForm = false;
//         toast({
//           title:"Required fields are missing",
//           className:"text-red-600"
//         })
//         break;
//       }else isValidForm = true;
//     }
//     if(isValidForm){
//       const sanitizedData = {...data, pse:data?.pse?.selected || [], status:"New"}
//       console.log(sanitizedData);
//       const result = await CreateDocument(process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB, process.env.NEXT_PUBLIC_VNG_CLAIMS, sanitizedData);
//       if(result.success){
//         reset();
//         nextStep();
//       }
//     } 
//   }
  const ctxValue = {
    register,
    handleSubmit,
    errors,
    // onSubmit,
    trigger,
    isValid,
    getValues,
    watchAllFields,
    watch
  };
  return (
    <InspectionFormContext.Provider value={ctxValue}>
      {children}
    </InspectionFormContext.Provider>
  );
};

export default InspectionFormProvider;

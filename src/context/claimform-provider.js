"use client";
const {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} = require("react");
import { useForm } from "react-hook-form";
import { useClaimDataContext } from "./claimData-provider";
import { toast } from "@/components/ui/use-toast";
import {
  CreateDocument,
  GetDocumentByDocId,
  UpdateDocument,
} from "@/cms/DatabaseHelpers/database-helper";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { emailSender } from "@/functions/send-email";
import { useAuthContext } from "./auth-provider";
import assignClaimMail from "@/components/email-templates/AssignClaimMail";
import { useMultiStepContext } from "@/context/multistep-provider";

const ClaimFormContext = createContext({});

export const useClaimFormContext = () => {
  return useContext(ClaimFormContext);
};

const ClaimFormProvider = ({ children }) => {
  const [allErrors, setAllError] = useState([]);
  const { data: formQuestions } = useClaimDataContext();
  const { nextStep, prevStep, step, setStep } = useMultiStepContext();
  const { currentUser } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentId, setDocumentId] = useState("");
  const [fetchedData, setFetchedData] = useState(null);
  const params = useParams();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, dirtyFields },
    trigger,
    getValues,
    reset,
    setValue,
  } = useForm({
    reValidateMode: "onBlur",
    mode: "onBlur",
    criteriaMode: "all",
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  // Load form data from local storage when component mounts
  useEffect(() => {
    if (!params?.id) {
      const savedData = JSON.parse(localStorage.getItem("formData"));
      if (savedData) {
        reset(savedData);
      }
    }
    // else if(params?.id){
    //   const savedData = JSON.parse(localStorage.getItem(`${params?.id}formDataUpdate`));
    //   if (savedData) {
    //     reset(savedData);
    //   }
    // }
  }, [params?.id, reset, router]);

  useEffect(() => {
    const fetchDefaultValues = async () => {
      const res = await GetDocumentByDocId(
        process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
        process.env.NEXT_PUBLIC_VNG_CLAIMS,
        params?.id
      );
      setDocumentId(res?.data?.$id);
      setFetchedData(res?.data);
      reset(res?.data);
    };
    if (params?.id) {
      fetchDefaultValues();
    } else reset();
  }, [params?.id, reset]);

  // Save form data to local storage on change
  useEffect(() => {
    if (!params?.id) {
      const subscription = watch((value) => {
        localStorage.setItem("formData", JSON.stringify(value));
      });
      return () => subscription.unsubscribe();
    }
    // else if(params?.id){
    //   const subscription = watch((value) => {
    //     localStorage.setItem(`${params?.id}formDataUpdate`, JSON.stringify(value));
    //   });
    //   return () => subscription.unsubscribe();
    // }
  }, [watch, params?.id, router]);

  const plumber_fix = watch("plumber_fix", false);
  const previous_plumbing_issue = watch("previous_plumbing_issue", false);
  const location_of_loss = watch("location_of_loss", false);
  const peril = watch("peril", false);
  const id_secondary_contact = watch("id_secondary_contact", false);
  const id_public_adjuster = watch("id_public_adjuster", false);
  const onSubmit = async (data) => {
    // Create a map of field names to their toggle group names
    const toggleGroups = {};
    formQuestions.forEach((field) => {
      if (field.ToggleGroup) {
        toggleGroups[field.FieldName] = field.ToggleGroup;
      }
    });

    // Create a map of toggle group values
    const toggleGroupValues = {};
    for (let key in data) {
      if (toggleGroups[key]) {
        const toggleGroupFieldName = toggleGroups[key];
        if (data[toggleGroupFieldName]) {
          toggleGroupValues[toggleGroupFieldName] = data[toggleGroupFieldName];
        }
      }
    }
    const newData = data;
    for (let key in data) {
      // If the toggle group field value is "No", set the field's newValue to null
      const toggleGroupFieldName = toggleGroups[key];
      if (
        toggleGroupFieldName &&
        toggleGroupValues[toggleGroupFieldName] === "No"
      ) {
        newData[key] = "";
      }
    }

    let isValidForm;
    setIsSubmitting(true);
    let formQ = formQuestions.filter((p) => p.Required === true);
    // Array to store the missing field objects
    let missingFields = [];

    for (let i = 0; i < formQ.length; i = i + 1) {
      const name = formQ[i].FieldName;
      if (!data[name] || data[name]?.length === 0) {
        isValidForm = false;
        // Add the field object to the missingFields array
        missingFields.push(formQ[i]);
      } else {
        isValidForm = true;
      }
    }

    if (missingFields.length > 0) {
      toast({
        title: "Required fields are missing",
        className: "text-red-600",
      });
      // Log the missing field objects
      setAllError(missingFields);
      setIsSubmitting(false);
      return; // Exit the function early since the form is not valid
    }
    if (isValidForm) {
      const sanitizedData = {
        ...newData,
        pse: data?.pse?.selected || [],
        status: "New",
        createdBy_name: currentUser?.name,
        createdBy_phone: currentUser?.phone,
        createdBy_email: currentUser?.email,
        createdAt_id: currentUser?.$id,
      };
      for (let key in sanitizedData) {
        if (key[0] === "$") delete sanitizedData[key];
      }
      const result = params.id
        ? await UpdateDocument(
            process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
            process.env.NEXT_PUBLIC_VNG_CLAIMS,
            documentId,
            sanitizedData
          )
        : await CreateDocument(
            process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
            process.env.NEXT_PUBLIC_VNG_CLAIMS,
            sanitizedData
          );
      if (result.success) {
        const siteUrl = window.location.origin;
        // const url = `${siteUrl}/claims/inspect/${result?.data?.carrier_claim_number}/?id=${result?.data?.$id}`;
        const url = `${siteUrl}/claims/inspect/${result?.data?.$id}`;
        localStorage.removeItem("formData"); // Clear local storage after successful submission
        setIsSubmitting(false);
        reset();
        nextStep();
        const emailHtml = await assignClaimMail(
          "A new claim assigned to you.",
          result?.data?.adjuster_name,
          result?.data?.adjuster_email,
          `Vanguard Claim Number: <b>${result?.data?.vanguard_claim_number}</b> has been assigned to you!<br/>
          <a href="${url}" style="display:inline-block;padding: 4px 20px;font-size:16px;color:#fff;background-color: #0F172A;border:none;border-radius:5px;text-decoration:none;text-align:center;margin-top: 10px;">Inspect Claim</a>`
        );
        const res = await emailSender(
          result?.data?.adjuster_email,
          emailHtml,
          "A new claim assigned to you."
        );
        setAllError([]);
        setTimeout(() => {
          router.push("/claims");
          setStep(1);
        }, 500);
      }
      if (result.success && params?.id) {
        setIsSubmitting(false);
        reset();
        toast({
          title: "Claim edited",
        });
        setTimeout(() => {
          router.push("/claims");
        }, 500);
      }
    }
    setIsSubmitting(false);
  };

  const ctxValue = useMemo(() => {
    return {
      register,
      handleSubmit,
      errors,
      onSubmit,
      trigger,
      isValid,
      getValues,
      setAllError,
      allErrors,
      setValue,
      reset,
      isSubmitting,
      fetchedData,
      watchingvalues: {
        plumber_fix,
        previous_plumbing_issue,
        location_of_loss,
        peril,
        id_secondary_contact,
        id_public_adjuster,
      },
      watch,
    };
  }, [
    register,
    handleSubmit,
    errors,
    onSubmit,
    trigger,
    isValid,
    getValues,
    setAllError,
    allErrors,
    setValue,
    reset,
    isSubmitting,
    fetchedData,
    id_public_adjuster,
    id_secondary_contact,
    location_of_loss,
    peril,
    plumber_fix,
    previous_plumbing_issue,
    watch,
  ]);

  return (
    <ClaimFormContext.Provider value={ctxValue}>
      {children}
    </ClaimFormContext.Provider>
  );
};

export default ClaimFormProvider;

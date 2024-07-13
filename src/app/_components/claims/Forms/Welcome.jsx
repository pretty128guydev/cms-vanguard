"use client";
import { useEffect, useState } from "react";
import { useClaimFormContext } from "@/context/claimform-provider";
import { useClaimDataContext } from "@/context/claimData-provider";
import { useAuthContext } from "@/context/auth-provider";
import { useParams } from "next/navigation";
import Loading from "@/components/shared/Loading";
import { renderInputField } from "./renderInputField";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const Welcome = () => {
  const { register, errors, getValues, setValue, reset, allErrors } = useClaimFormContext();
  const { data, loading } = useClaimDataContext();
  const { isAdmin, isSuperAdmin } = useAuthContext();
  const router = useRouter();
  const params = useParams();

  const [toggleValues, setToggleValues] = useState({});
  const [errorObject, setErrorObject] = useState({}); // Initialize with an empty object
  const [formKey, setFormKey] = useState(Date.now()); // Key to force re-render
  const [shouldReset, setShouldReset] = useState(false); // State to trigger reset

  const handleClearForm = async () => {
    await localStorage.removeItem("formData");
    await reset(); // Reset form values using react-hook-form's reset function
    setToggleValues({}); // Reset toggle values state
    setShouldReset(true); // Trigger form reset
        toast({
      title: "Form cleared",
      description: "The form has been cleared.",
    });
  };

  const handleToggleChange = (fieldName, value) => {
    setToggleValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    console.log(`Toggle ${fieldName} changed to: ${value}`);
  };

  useEffect(() => {
    console.log("Toggle Values: ", toggleValues);
  }, [toggleValues]);

  // Convert allErrors array to an object and extract NavigationGroups with errors
  useEffect(() => {
    const errorObj = allErrors.reduce((acc, error) => {
      acc[error.FieldName] = error;
      return acc;
    }, {});

    setErrorObject(errorObj);

  }, [allErrors]);

  // Get initial toggle values
  useEffect(() => {
    if (!loading && data && data.length > 0) {
      const initialToggleValues = data
        .filter((item) => item.NavigationGroup === "Welcome")
        .filter((item) => item.FieldType === "Toggle")
        .reduce((acc, item) => {
          acc[item.FieldName] = getValues(item.FieldName);
          return acc;
        }, {});
      setToggleValues(initialToggleValues);
    }
  }, [loading, data, getValues]);



  // Filter logic based on toggleValues
  const filteredData = !loading && data && data.length > 0
    ? data
        .filter((item) => item.NavigationGroup === "Welcome")
        .filter(
          (item) =>
            !item.ToggleGroup || toggleValues[item.ToggleGroup] === "Yes"
        )
    : [];
  // Reset form fields when shouldReset is true
  useEffect(() => {
    if (shouldReset) {
      data.forEach((item) => {
        setValue(item.FieldName, ""); // Reset each field value
      });
      setShouldReset(false); // Reset the trigger
    }
  }, [shouldReset, filteredData, setValue]);

  return (
    <div key={formKey} className="">
      <div className="mb-4 flex justify-between">
        <h2 className="font-bold text-2xl">Dispatcher Triage Form</h2>
        {!params?.id && (
          <button
            onClick={handleClearForm}
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1"
          >
            Clear Form
          </button>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : (
        filteredData.map((item) =>
          renderInputField({
            label: item.FieldLabel,
            type: item.FieldType,
            fieldName: item.FieldName,
            register,
            errors,
            isRequired: item.Required,
            data: item.dropdownItems ? item.dropdownItems.MenuItems : [],
            handleToggleChange,
            setValue,
            errorObject,
          })
        )
      )}
    </div>
  );
};

export default Welcome;

"use client"
import React, { useState, useEffect } from "react";
import { renderInputField } from "./renderInputField";
import { useClaimFormContext } from "@/context/claimform-provider";
import { useClaimDataContext } from "@/context/claimData-provider";
import Loading from "@/components/shared/Loading";

const Loss = () => {
  const { register, errors, getValues, setValue, reset, allErrors } = useClaimFormContext();
  const { data, loading } = useClaimDataContext();
  const [toggleValues, setToggleValues] = useState({});
  const [errorObject, setErrorObject] = useState({}); // Initialize with an empty object

  const handleToggleChange = (fieldName, value) => {
    setToggleValues(prev => ({
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
        .filter(item => item.NavigationGroup === 'Loss')
        .filter(item => item.FieldType === 'Toggle')
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
        .filter(item => item.NavigationGroup === 'Loss')
        .filter(item => !item.ToggleGroup || toggleValues[item.ToggleGroup] === 'Yes')
    : [];

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-bold text-2xl">Loss</h2>
      </div>
      
      {loading ? <Loading /> : filteredData.map(item => (
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
      ))}
    </div>
  );
};

export default Loss;

"use client";
import { useInspectionDataContext } from "@/context/inspectionData-provider";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { renderInspectionInputs } from "./renderInspectionInputs";
import Loading from "@/components/shared/Loading";

const Coverage = () => {
  const [toggleValues, setToggleValues] = useState({});
  const { data, loading } = useInspectionDataContext();
  const { register, watch, getValues, errors } = useFormContext();

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



  const watchAllFields = watch();

  // Get initial toggle values
  useEffect(() => {
    if (!loading && data && data.length > 0) {
      const initialToggleValues = data
        .filter((item) => item.NavigationGroup === "Coverage")
        .filter((item) => item.FieldType === "Toggle")
        .reduce((acc, item) => {
          acc[item.FieldName] = getValues(item.FieldName).newValue;
          return acc;
        }, {});
      setToggleValues(initialToggleValues);
    }
  }, [loading, data, getValues]);


    // Filter logic based on toggleValues
const InspectionQuestions = !loading && data && data.length > 0
? data
    .filter((item) => item.NavigationGroup === "Coverage")
    .filter(
      (item) =>
        !item.ToggleGroup || toggleValues[item.ToggleGroup] === "Yes"
    ).sort((a, b) => a.DisplayOrder - b.DisplayOrder)
: [];




  // const InspectionQuestions = data
  //   ?.filter((item) => item.NavigationGroup === "Coverage")
  //   .sort((a, b) => a.DisplayOrder - b.DisplayOrder);
  return (
    <div>
      <h1 className="text-3xl font-bold">Coverage</h1>
      <div className="mt-4">
        {!loading && InspectionQuestions && InspectionQuestions.length > 0 ? (
          InspectionQuestions.map((question, i) =>
            renderInspectionInputs({
              question,
              register,
              errors,
              getValues,
              watchAllFields,
              handleToggleChange,
            })
          )
        ) : (
          <Loading />
        )}
      </div>
    </div>
  );
}

export default Coverage

"use client";
import { CreateDocument } from "@/cms/DatabaseHelpers/database-helper";
import { useInspectionDataContext } from "@/context/inspectionData-provider";
import { useInspectionFormContext } from "@/context/inspectionForm-provider";
import React, { useEffect, useState } from "react";
import ToggleSlider from "@/components/shared/ToggleSlider";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import ValidateAndPrompt from "@/components/shared/ValidateAndPrompt";
import Loading from "@/components/shared/Loading";
import { renderInspectionInputs } from "./renderInspectionInputs";

const Inspection = ({handleClearForm}) => {
  const [toggleValues, setToggleValues] = useState({});
  const { data, loading } = useInspectionDataContext();
  const { register, watch, getValues, errors } = useFormContext();
  const handleToggleChange = (fieldName, value) => {
    setToggleValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // console.log(`Toggle ${fieldName} changed to: ${value}`);
  };

  useEffect(() => {
    // console.log("Toggle Values: ", toggleValues);
  }, [toggleValues]);

  const watchAllFields = watch();

  // Get initial toggle values
  useEffect(() => {
    if (!loading && data && data.length > 0) {
      const initialToggleValues = data
        .filter((item) => item.NavigationGroup === "Inspection")
        .filter((item) => item.FieldType === "Toggle")
        .reduce((acc, item) => {
          acc[item.FieldName] = getValues(item.FieldName).newValue;
          return acc;
        }, {});
      setToggleValues(initialToggleValues);
    }
  }, [loading, data, getValues]);

  // Filter logic based on toggleValues
  const InspectionQuestions =
    !loading && data && data.length > 0
      ? data
          .filter((item) => item.NavigationGroup === "Inspection")
          .filter(
            (item) =>
              !item.ToggleGroup || toggleValues[item.ToggleGroup] === "Yes"
          )
          .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
      : [];

  // const InspectionQuestions = data
  //   ?.filter((item) => item.NavigationGroup === "Inspection")
  //   .sort((a, b) => a.DisplayOrder - b.DisplayOrder);
  return (
    <div className="">
      <div className="mb-4 flex justify-between">
        <h1 className="text-3xl font-bold">Inspection</h1>
        <button
            onClick={handleClearForm}
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1"
          >
            Clear Form
          </button>
      </div>
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
};

export default Inspection;

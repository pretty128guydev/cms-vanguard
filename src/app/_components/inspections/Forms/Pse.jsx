"use client";
import { useInspectionDataContext } from "@/context/inspectionData-provider";
import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { renderInspectionInputs } from "./renderInspectionInputs";
import Loading from "@/components/shared/Loading";
import { useClaimDataContext } from "@/context/claimData-provider";
import VoiceToTextTextarea from "@/components/shared/voice-to-text-inspection";

const Pse = () => {
  const { data, loading, claimData } = useInspectionDataContext();
  const { register, watch, getValues, errors, setValue } = useFormContext();
  const { data: questions } = useClaimDataContext();
  const watchAllFields = watch();
  const val = watch("pse");
  const [isChecked, setIsChecked] = useState(val?.isCorrect || null);
  useEffect(() => {
    setIsChecked(
      val?.isCorrect === "Yes" ? true : val?.isCorrect === "No" ? false : null
    );
  }, [val]);

  const handleToggleChange = (e) => {
    const value = e.target.value === "Yes";
    setIsChecked(value);
    setValue(`pse.isCorrect`, e.target.value);
  };

  const InspectionQuestions = data
    ?.filter((item) => item.NavigationGroup === "PSE")
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder);
  return (
    <div>
      {/* <div className="flex justify-between w-full text-gray-500 items-center mb-3">
        <h2 className="w-[95%]">Are these PSEs correct?</h2>
        <div className="relative inline-block w-10 align-middle select-none transition duration-300 ease-in-out">
        <input
            type="checkbox"
            id={"pse"}
            value={isChecked ? "Yes" : "No"}
            checked={isChecked}
            {...register("pse.isCorrect")}
            onChange={handleToggle}
            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-500 appearance-none cursor-pointer transition duration-300 ease-in-out"
          />
          <label
            htmlFor={"pse"}
            className={`toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer transition duration-300 ease-in-out ${
              isChecked ? "bg-gray-900" : ""
            }`}
          ></label>
        </div>
      </div> */}

      <h1 className="text-3xl font-bold">PSEs</h1>
      <div className="mb-3">
        <h2 className="w-full text-gray-500">Are these PSEs correct?</h2>
        <div className="flex gap-2 mt-2">
          <label className="flex justify-between border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5">
            Yes
            <input
              {...register(`pse.isCorrect`, {
                setValueAs: (value) => value,
              })}
              id={`pse-yes`}
              type="radio"
              value="Yes"
              name={`pse.isCorrect`}
              checked={isChecked === true}
              onChange={handleToggleChange}
            />
          </label>
          <label className="flex justify-between border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5">
            No
            <input
              {...register(`pse.isCorrect`, {
                setValueAs: (value) => value,
              })}
              id={`pse-no`}
              type="radio"
              value="No"
              name={`pse.isCorrect`}
              checked={isChecked === false}
              onChange={handleToggleChange}
            />
          </label>
        </div>
      </div>
      <div className="mt-4">
        {isChecked &&
          (InspectionQuestions && InspectionQuestions.length > 0 ? (
            InspectionQuestions.map((item, i) => {
              return (
                <div key={i}>
                  {item.FieldType === "Checkbox" ? (
                    <div className="flex gap-2">
                      <input
                        type="checkbox"
                        checked={item.FieldValue}
                        disabled="disabled"
                      />
                      <label>{item.FieldLabel}</label>
                    </div>
                  ) : item.FieldType === "Text Area (voice to text enabled)" ? (
                    <div>
                      <label>{item.FieldLabel}</label>
                      <textarea
                        value={item.FieldValue}
                        className="w-full p-2 border rounded"
                        disabled="disabled"
                      />
                    </div>
                  ) : (
                    <p>{`${item.FieldLabel} : ${item.FieldValue}`}</p>
                  )}
                </div>
              );
            })
          ) : (
            <p>No PSE</p>
          ))}

        {!isChecked && (
          <div>
            {!loading &&
            InspectionQuestions &&
            InspectionQuestions.length > 0 ? (
              InspectionQuestions.map((question, i) =>
                renderInspectionInputs({
                  question,
                  register,
                  errors,
                  getValues,
                  watchAllFields,
                })
              )
            ) : (
              <Loading />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pse;

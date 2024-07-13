"use client";
import React, { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import VoiceToTextTextarea from "@/components/shared/voice-to-text-inspection";
import GoogleMapWithAutocompleteAdjuster from "@/components/shared/map/GoogleMapWithAutocompleteAdjuster";

const ValidateAndPrompt = ({
  id,
  label,
  register,
  userDetails,
  getValues,
  placeholder,
  ChildFieldType,
  dropdownItems,
  FieldLabel,
  isRequired,
}) => {
  const { watch, setValue } = useFormContext();
  const val = watch(id);
  const [isChecked, setIsChecked] = useState(val?.isCorrect || null);

  useEffect(() => {
    setIsChecked(val?.isCorrect === "Yes" ? true : val?.isCorrect === "No" ? false : null);
  }, [val]);

  const handleToggleChange = (e) => {
    const value = e.target.value === "Yes";
    setIsChecked(value);
    setValue(`${id}.isCorrect`, e.target.value);
  };

  const renderInputField = () => {
    switch (ChildFieldType) {
      case "Dropdown":
        return (
          <select
            {...register(`${id}.newValue`)}
            className="py-2 px-3 w-full rounded-lg ring-1 ring-neutral-300"
          >
            <option value="" disabled selected>
              {FieldLabel}
            </option>
            {dropdownItems.MenuItems.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        );
      case "DropdownBoolean":
        return (
          <select
            {...register(`${id}.newValue`)}
            className="py-2 px-3 w-full rounded-lg ring-1 ring-neutral-300"
          >
            <option value="" disabled selected>
              {FieldLabel}
            </option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        );
      case "TextFieldMaps":
        return (
          <GoogleMapWithAutocompleteAdjuster
            name={id}
            label={FieldLabel}
            isRequired={isRequired}
            register={register}
          />
        );
      case "DropdownNumber":
        return (
          <select
            {...register(`${id}.newValue`)}
            className="py-2 px-3 w-full rounded-lg ring-1 ring-neutral-300"
          >
            <option value="" disabled selected>
              {FieldLabel}
            </option>
            {[...Array(99)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        );
      case "Datepicker":
        return (
          <input
            type="date"
            {...register(`${id}.newValue`)}
            className="py-2 px-3 w-full rounded-lg ring-1 ring-neutral-300"
          />
        );
      case "Textarea":
        return (
          <textarea
            {...register(`${id}.newValue`)}
            placeholder={placeholder}
            className="py-2 px-3 w-full rounded-lg ring-1 ring-neutral-300"
          />
        );
      case "Text Area (voice to text enabled)":
        return (
          <VoiceToTextTextarea
            name={`${id}.newValue`}
            label={FieldLabel}
            isRequired={isRequired}
            register={register}
          />
        );
      case "TextField":
      default:
        return (
          <input
            type="text"
            {...register(`${id}.newValue`)}
            placeholder={placeholder}
            className="py-2 px-3 w-full rounded-lg ring-1 ring-neutral-300"
          />
        );
    }
  };

  return (
    <section>
      <div className="mb-3">
        {label && <h2 className="w-full text-gray-500">{label} </h2>}
        <div className="flex gap-2 mt-2">
          <label className="flex justify-between border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5">
            Yes
            <input
              {...register(`${id}.isCorrect`, {
                setValueAs: (value) => value,
              })}
              id={`${id}-yes`}
              type="radio"
              value="Yes"
              name={`${id}.isCorrect`}
              checked={isChecked === true}
              onChange={handleToggleChange}
            />
          </label>
          <label className="flex justify-between border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5">
            No
            <input
              {...register(`${id}.isCorrect`, {
                setValueAs: (value) => value,
              })}
              id={`${id}-no`}
              type="radio"
              value="No"
              name={`${id}.isCorrect`}
              checked={isChecked === false}
              onChange={handleToggleChange}
            />
          </label>
        </div>
      </div>
      {isChecked === null || isChecked === true ? "" : renderInputField()}
    </section>
  );
};

export default ValidateAndPrompt;

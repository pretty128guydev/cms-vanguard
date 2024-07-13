"use client";
import React, { useEffect, useState } from 'react';
import { useFormContext } from "react-hook-form";

export default function InspectionToggle({ question, onChange, register }) {
  const { watch, setValue } = useFormContext();
  const val = watch(`${question.FieldName}.newValue`);
  const [isChecked, setIsChecked] = useState(null);

  useEffect(() => {
    setIsChecked(val);
  }, [val]);

  const handleToggleChange = (e) => {
    const value = e.target.value;
    setIsChecked(value);
    setValue(`${question.FieldName}.newValue`, value);
    onChange(question.FieldName, value);
  };

  return (
    <div className="mb-3">
      {question.FieldLabel && <h2 className="w-full text-gray-500">{question.FieldLabel}</h2>}
      <div className="flex gap-2 mt-2">
        <label className="flex justify-between border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5">
          Yes
          <input
            {...register(`${question.FieldName}.newValue`, {
              setValueAs: (value) => value,
            })}
            id={`${question.FieldName}-yes`}
            type="radio"
            value="Yes"
            name={`${question.FieldName}.newValue`}
            checked={isChecked === 'Yes'}
            onChange={handleToggleChange}
          />
        </label>
        <label className="flex justify-between border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5">
          No
          <input
            {...register(`${question.FieldName}.newValue`, {
              setValueAs: (value) => value,
            })}
            id={`${question.FieldName}-no`}
            type="radio"
            value="No"
            name={`${question.FieldName}.newValue`}
            checked={isChecked === 'No'}
            onChange={handleToggleChange}
          />
        </label>
      </div>
    </div>
  );
}

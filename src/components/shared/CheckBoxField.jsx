"use client";
import React, { useState } from "react";
import { ErrorMessage } from "@hookform/error-message"; // Ensure this is imported

export default function CheckboxWithState({ fieldName, label, isRequired, register, errors }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
  };

  return (
    <div className="flex items-center mb-3">
      <input
        type="checkbox"
        id={fieldName}
        className="mr-2 accent-black"
        // checked={isChecked}
        onChange={handleChange}
        {...register(fieldName, {
          required: isRequired,
          onChange: (e) => setIsChecked(e.target.checked), // Ensure the form value updates
          setValueAs: (value) => value === true,
        })}
      />
      <label htmlFor={fieldName}>
        {label}
        {isRequired && "*"}
      </label>
      {errors && (
        <ErrorMessage
          errors={errors}
          name={fieldName}
          render={() => (
            <p className="text-red-600 -mt-2 text-xs mb-2">
              {label} is required
            </p>
          )}
        />
      )}
    </div>
  );
}

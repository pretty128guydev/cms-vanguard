"use client";
import { useInspectionFormContext } from "@/context/inspectionForm-provider";
import { Input } from "postcss";
import React, { useRef, useState } from "react";

const ToggleSwitch = ({ id, label, register, userDetails, onChange  }) => {
  const [isChecked, setIsChecked] = useState(false);
  const inputRef = useRef();
  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    onChange(newValue);
  };
  return (
    <div className="flex justify-between w-full text-gray-500 items-center mb-3">
      {label && (
        <h2 className="w-[95%]">
          {label}{" "}
          {/* {id === "loss_discovered_by" &&
            (userDetails.firstName || userDetails.lastName
              ? `${userDetails.firstName || ""} ${
                  userDetails.lastName || ""
                }`.trim()
              : "")} */}
        <label>(No/Yes)</label>
        </h2>
        
      )}
      <div className="relative inline-block w-10 align-middle select-none transition duration-300 ease-in-out">
        <input
          type="checkbox"
          id={id}
          checked={isChecked}
          {...register(id, {
            setValueAs: (_id) => isChecked,
            onChange: handleToggle,
          })}
          className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 border-gray-500 appearance-none cursor-pointer transition duration-300 ease-in-out"
        />
        <label
          htmlFor={id}
          className={`toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer transition duration-300 ease-in-out ${
            isChecked ? "bg-gray-900" : ""
          }`}
        ></label>
      </div>
    </div>
  );
};

export default ToggleSwitch;

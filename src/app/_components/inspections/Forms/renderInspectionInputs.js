"use client";
import React from "react";
import ToggleSlider from "@/components/shared/ToggleSlider";
import { ErrorMessage } from "@hookform/error-message";
import { IoLocationOutline } from "react-icons/io5";
import ValidateAndPrompt from "@/components/shared/ValidateAndPrompt";
import { CiMicrophoneOn } from "react-icons/ci";
import VoiceToTextTextarea from "@/components/shared/voice-to-text-inspection";
import InspectionToggle from "@/components/shared/InspectionToggle";
import CheckboxWithState from "@/components/shared/CheckBoxField";

export const renderInspectionInputs = ({
  question,
  register,
  errors,
  getValues,
  watchAllFields,
  userDetails,
  handleToggleChange,
}) => {
  switch (question.FieldType) {
    case "Validate and Prompt":
      return (
        <div key={question.$id} className="py-2">
          {question.FieldName === "loss_discovered_by" ? (
            <>
              <label className="sm:text-lg text-md font-medium">
                {question.FieldLabel} :
              </label>
              {userDetails.firstName || userDetails.lastName
                ? `${userDetails.firstName || ""} ${userDetails.lastName || ""}
              `.trim()
                : ""}
            </>
          ) : (
            <label className="sm:text-lg text-md font-medium">
              {question.FieldLabel} : {question?.FieldValue || "N/A"}
            </label>
          )}
          <ValidateAndPrompt
            id={question.FieldName}
            label="Is this correct?"
            register={register}
            watchAllFields={watchAllFields}
            getValues={getValues}
            placeholder={question.FieldLabel}
            ChildFieldType={question.ChildFieldType}
            dropdownItems={question.dropdownItems}
            FieldLabel={question.FieldLabel}
            isRequired={question.Required}
          />
        </div>
      );
    case "Prefilled Text":
      return (
        <div>
          <label className="sm:text-lg text-md font-medium">
            {question.FieldLabel} : {question?.FieldValue || "N/A"}
          </label>
        </div>
      );
    case "Toggle":
      return (
        <InspectionToggle
          question={question}
          onChange={handleToggleChange}
          register={register}
        />
      );
    case "TextField":
      return (
        <div className="py-2">
          <label className="sm:text-lg text-md font-medium">
            {`${question?.FieldLabel}${question.Required ? "*" : ""}`}
          </label>
          <input
            type="text"
            name={question?.FieldName}
            placeholder={`${question?.FieldLabel}${
              question.Required ? "*" : ""
            }`}
            {...register(`${question.FieldName}.newValue`, {
              required: question.Required,
            })}
            className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
          />
          {errors && (
            <ErrorMessage
              errors={errors}
              name={question?.FieldName}
              render={({}) => (
                <p className="text-red-600 -mt-2 text-xs mb-2">
                  {question?.FieldLabel} is required
                </p>
              )}
            />
          )}
        </div>
      );
    case "Dropdown":
      return (
        <div className="py-4">
          <select
            name={question.FieldName}
            className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            {...register(`${question.FieldName}.newValue`, {
              required: question.Required,
            })}
          >
            <option value="" disabled selected>
              {question.FieldLabel}
              {question.Required && "*"}
            </option>
            {question?.dropdownItems?.MenuItems &&
              question?.dropdownItems?.MenuItems.length > 0 &&
              question?.dropdownItems?.MenuItems.map((item) => {
                return (
                  <option key={new Date().getMilliseconds} value={item}>
                    {item}
                  </option>
                );
              })}
          </select>
        </div>
      );
    case "DropdownNumber":
      return (
        <div className="py-4">
          <select
            name={question.FieldName}
            className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3"
            {...register(String(`${question.FieldName}.newValue`), {
              required: question.Required,
            })}
          >
            <option value="" disabled selected>
              {question.FieldLabel}
              {question.Required && "*"}
            </option>
            {[...Array(99)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      );
      case "TextArea":
        const roomsDamaged = watchAllFields.rooms_damaged || {};
        const roomNumber = roomsDamaged.newValue || roomsDamaged.oldValue;
        const isDescriptionOfDamage = question.FieldName === "description_of_damage";
        const parsedRoomNumber = parseInt(roomNumber, 10);
        const validRoomNumber =
          !isNaN(parsedRoomNumber) && parsedRoomNumber > 0 ? parsedRoomNumber : 1;
      
        return (
          <div>
            <label className="sm:text-lg text-md font-medium">
              {`${question?.FieldLabel}${question.Required ? "*" : ""}`}
            </label>
            {isDescriptionOfDamage ? (
              [...Array(validRoomNumber)].map((_, index) => (
                <textarea
                  key={index}
                  name={`${question.FieldName}[${index}]`}
                  placeholder={`${question.FieldLabel} ${index + 1}${
                    question.Required ? "*" : ""
                  }`}
                  className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 h-24"
                  {...register(`${question.FieldName}[${index}]`, {
                    required: question.Required,
                  })}
                ></textarea>
              ))
            ) : (
              <textarea
                name={question.FieldName}
                placeholder={`${question.FieldLabel}${
                  question.Required ? "*" : ""
                }`}
                className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 h-24"
                {...register(`${question.FieldName}.newValue`, {
                  required: question.Required,
                })}
              ></textarea>
            )}
          </div>
        );
      
    case "Checkbox":
      return (
        <>
          <CheckboxWithState
            fieldName={`${question.FieldName}.newValue`}
            label={question.FieldLabel}
            isRequired={question.Required}
            register={register}
            errors={false}
          />
          {/* <input
            type="checkbox"
            id={question.FieldName}
            className="mr-2 accent-black"
            {...register(`${question.FieldName}.newValue`, {
              required: question.Required,
            })}
            value={question.FieldLabel}
          />
          <label htmlFor={question.FieldName}>
            {question.FieldLabel}
            {question.Required && "*"}
          </label> */}
        </>
      );

    case "Datepicker":
      return (
        <>
          <label>
            {question.FieldLabel}
            {question.Required && "*"}
          </label>
          <input
            type="date"
            placeholder={question.FieldLabel}
            name={question.FieldName}
            {...register(`${question.FieldName}.newValue`, {
              required: question.Required,
            })}
            className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
          />
          {errors && (
            <ErrorMessage
              errors={errors}
              name={question.FieldName}
              render={({}) => (
                <p className="text-red-600 -mt-2 text-xs mb-2">
                  {question.FieldLabel} is required
                </p>
              )}
            />
          )}
        </>
      );
    case "Text Area (voice to text enabled)":
      return (
        <>
          <VoiceToTextTextarea
            name={`${question.FieldName}.newValue`}
            label={question.FieldLabel}
            isRequired={question.Required}
            register={register}
          />
        </>
      );
    default:
      return null;
  }
};

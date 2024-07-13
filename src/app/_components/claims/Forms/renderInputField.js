import React from "react";
import ToggleSlider from "@/components/shared/ToggleSlider";
import { ErrorMessage } from "@hookform/error-message";
import VoiceToTextTextarea from "@/components/shared/voice-to-text";
import CheckboxWithState from "@/components/shared/CheckBoxField";
import ToggleYesNo from "@/components/shared/ToggleYesNo";
import GoogleMapWithAutocomplete from "@/components/shared/map/GoogleMapWithAutocomplete";

export const renderInputField = ({
  label,
  type,
  fieldName,
  register,
  errors,
  isRequired = false,
  data,
  navigationGroup,
  userDetails,
  handleToggleChange,
  setValue,
  errorObject,
  // renderMap,
}) => {
  const fieldError = errorObject && errorObject[fieldName]?.FieldLabel ? `${errorObject[fieldName].FieldLabel} is required` : null;

  const renderErrorMessage = () => {
    if (fieldError) {
      return <p className="text-red-600 -mt-2 text-xs mb-2">{fieldError}</p>;
    }
    if (errors && errors[fieldName]) {
      return (
        <ErrorMessage
          errors={errors}
          name={fieldName}
          render={({ message }) => (
            <p className="text-red-600 -mt-2 text-xs mb-2">{message}</p>
          )}
        />
      );
    }
    return null;
  };

  switch (type) {
    case "Dropdown":
      return (
        <>
        <label htmlFor={fieldName} className="text-sm mb-2 mt-3">{label} {isRequired && "*"}</label>
        <select
        id={fieldName}
          name={fieldName}
          className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
          {...register(fieldName, { required: isRequired })}
        >
          <option value="" disabled selected>
            {label}
            {isRequired && "*"}
          </option>
          {data &&
            data.length > 0 &&
            data.map((item) => {
              return (
                <option key={new Date().getMilliseconds} value={item}>
                  {item}
                </option>
              );
            })}
        </select>
        {renderErrorMessage()}
        </>
      );
    case "TextField":
      return (
        <>
        <label htmlFor={fieldName} className="text-sm mb-2 mt-3">{label} {isRequired && "*"}</label>
          <input
          id={fieldName}
            type="text"
            name={fieldName}
            placeholder={`${label}${isRequired ? "*" : ""}`}
            {...register(fieldName, { required: isRequired })}
            className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
          />
          {/* {errors && (
            <ErrorMessage
              errors={errors}
              name={fieldName}
              render={({}) => (
                <p className="text-red-600 -mt-2 text-xs mb-2">
                  {label} is required
                </p>
              )}
            />
          )} */}
           {renderErrorMessage()}
        </>
      );

    case "TextFieldMaps":
      return (
        <div>
          <GoogleMapWithAutocomplete
           name={fieldName}
           label={label}
           isRequired={isRequired}
           register={register}
           errors={errors}
           setValue={setValue}
          />
           {renderErrorMessage()}
        </div>
      );
    // case "Toggle":
    //   return (
    //     <ToggleSlider
    //       id={fieldName}
    //       label={label}
    //       onChange={(value) =>
    //         handleToggleChange && handleToggleChange(fieldName, value)
    //       }
    //       register={register}
    //       userDetails={userDetails}
    //     />
    //   );
    case "Toggle":
      return (
        // <ToggleSlider
        //   id={fieldName}
        //   label={label}
        //   onChange={(value) =>
        //     handleToggleChange && handleToggleChange(fieldName, value)
        //   }
        //   register={register}
        //   userDetails={userDetails}
        // />
        <>
        <ToggleYesNo
          id={fieldName}
          label={label}
          register={register}
          userDetails={userDetails}
          onChange={handleToggleChange }
          isRequired={isRequired}
        />
 {renderErrorMessage()}
        </>
      );
    case "TextArea":
      return (
        <>
        <label htmlFor={fieldName} className="text-sm mb-2 mt-3">{label} {isRequired && "*"}</label>
        <textarea
        id={fieldName}
          name={fieldName}
          placeholder={`${label}${isRequired ? "*" : ""}`}
          className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3 h-24"
          {...register(fieldName, { required: isRequired })}
          // Add onChange handler if needed
        ></textarea>
         {renderErrorMessage()}
        </>
      );

    case "Text Area (voice to text enabled)":
      return (
        <>
        <VoiceToTextTextarea
          name={fieldName}
          label={label}
          isRequired={isRequired}
          register={register}
          errors={errors}
        />
         {renderErrorMessage()}
        </>
      );

    case "DropdownNumber":
      return (
        <>
        <label htmlFor={fieldName} className="text-sm mb-2 mt-3">{label} {isRequired && "*"}</label>
        <select
        id={fieldName}
          name={fieldName}
          className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
          {...register(fieldName, { required: isRequired })}
        >
          <option value="" disabled selected>
            {label}
            {isRequired && "*"}
          </option>
          {[...Array(99)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
        {renderErrorMessage()}
        </>
      );
    case "DropdownBoolean":
      return (
        <>
        <label htmlFor={fieldName} className="text-sm mb-2 mt-3">{label} {isRequired && "*"}</label>
        <select
        id={fieldName}
          name={fieldName}
          className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
          {...register(fieldName, { required: isRequired })}
        >
          <option value="" disabled selected>
            {label}
            {isRequired && "*"}
          </option>
          <option value={"Yes"}>Yes</option>
          <option value={"No"}>No</option>
        </select>
        {renderErrorMessage()}
        </>
      );
    // case "Dropdown (4-digit year)":
    //   return (
    //     <input
    //       type="text"
    //       name={fieldName}
    //       placeholder={label}
    //       {...register(fieldName)}
    //       className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
    //       // Add onChange handler if needed
    //     />
    //   );

    // case "Dropdown (Yes, No) occupied/unoccupied":
    //   return (
    //     <select
    //       name={fieldName}
    //       className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
    //       {...register(fieldName)}
    //     >
    //       <option value="" disabled selected>
    //         {label}
    //       </option>
    //       <option value="occupied">Occupied</option>
    //       <option value="unoccupied">Un occupied</option>
    //     </select>
    //   );

    // case "Checkbox":
    //   // const values = fetchedData`${navigationGroup === "PSE" ? "pse" : "pse"}.selected`);
    //   // const isChecked = Array.isArray(values) && values.includes(label);
    //   // console.log(`is checkbox checked${isChecked}`);
    //   return (
    //     <div className="flex items-center mb-3">
    //       <input
    //         type="checkbox"
    //         id={fieldName}
    //         className="mr-2 accent-black"
    //         value={label}
    //         // defaultChecked={isChecked}
    //         {...register(
    //           `${fieldName}`,
    //           // `${navigationGroup === "PSE" ? "pse" : "pse"}.selected`,
    //           { required: isRequired }
    //         )}
    //       />
    //       <label htmlFor={fieldName}>
    //         {label}
    //         {isRequired && "*"}
    //       </label>
    //     </div>
    //   );

    case "Checkbox":
      return (
        <>
        <CheckboxWithState
          fieldName={fieldName}
          label={label}
          isRequired={isRequired}
          register={register}
          errors={errors}
          ErrorMessage={ErrorMessage}
        />
         {renderErrorMessage()}
        </>
      );

    case "DatePicker":
      return (
        <>
        <label htmlFor={fieldName} className="text-sm mb-2 mt-3">{label}  {isRequired && "*"}</label>
          <input
          id={fieldName}
            type="date"
            placeholder={label}
            name={fieldName}
            {...register(fieldName, { required: isRequired })}
            className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
          />
          {/* {errors && (
            <ErrorMessage
              errors={errors}
              name={fieldName}
              render={({}) => (
                <p className="text-red-600 -mt-2 text-xs mb-2">
                  {label} is required
                </p>
              )}
            />
          )} */}
           {renderErrorMessage()}
        </>
      );
    // Add cases for other types if needed
    default:
      return null;
  }
};

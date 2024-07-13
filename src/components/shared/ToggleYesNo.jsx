import React from 'react';

export default function ToggleYesNo({ id, label, register, onChange, isRequired }) {
  const handleToggleChange = (e) => {
    const value = e.target.value;
    onChange(id, value);
  };

  return (
    <div>
      <p className="text-sm mb-2 mt-3">{`${label} ${isRequired? "*" : ""}`}</p>
      <div className="flex gap-2">
        <label className="flex justify-between border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 mb-3">
          Yes
          <input
            {...register(id,{setValueAs: (value) => value,})}
            id={`${id}-yes`}
            type="radio"
            value="Yes"
            name={id}
            onChange={handleToggleChange}
          />
        </label>
        <label className="flex justify-between border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5 mb-3">
          No
          <input
            {...register(id,{setValueAs: (value) => value,})}
            id={`${id}-no`}
            type="radio"
            value="No"
            name={id}
            onChange={handleToggleChange}
          />
        </label>
      </div>
    </div>
  );
}

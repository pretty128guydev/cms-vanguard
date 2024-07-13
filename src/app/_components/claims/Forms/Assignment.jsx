"use client";
import React, { useEffect, useState } from "react";
import { useClaimFormContext } from "@/context/claimform-provider";
import { useClaimDataContext } from "@/context/claimData-provider";
import { getAdjusters } from "@/functions/user-team-adjusters";

const Assignment = () => {
  const { register, errors, setValue, watch, getValues } = useClaimFormContext();
  const { data, loading } = useClaimDataContext();
  const [allAdjusters, setAllAdjusters] = useState([]);
  const [adjustersLoading, setAdjustersLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    setAdjustersLoading(true);
    const fetch = async () => {
      try {
        const res = await getAdjusters();
        setAllAdjusters(res?.memberships || []);
        setAdjustersLoading(false);
      } catch (error) {
        // console.log(error.message);
        setAdjustersLoading(false);
      }
      setSelectedValue(getValues("adjusterId"));
    };
    fetch();
  }, []);


  const handleAdjusterChange = async (e) => {
    const selectedAdjusterId = e.target.value;
    const selectedAdjuster = allAdjusters.find(adjuster => adjuster.userId === selectedAdjusterId);
    setSelectedValue(selectedAdjusterId);
    if (selectedAdjuster) {
      setValue("adjuster_name", selectedAdjuster.userName);
      setValue("adjuster_email", selectedAdjuster.userEmail); 
    }
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-bold text-2xl">Adjuster Assignment</h2>
      </div>
      <select
        className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
        {...register("adjusterId", { onChange: handleAdjusterChange, setValueAs: (value) => value })}
        value={selectedValue}
      >
        <option value="" disabled selected>
          Choose an Adjuster
        </option>
        {!adjustersLoading && allAdjusters.length > 0 ? (
          allAdjusters.map((item) => {
            return (
              <option key={item.userId} value={item.userId}>
                {item.userName}
              </option>
            );
          })
        ) : (
          <option disabled>Loading...</option>
        )}
      </select>
      <div className="mb-4">
        <label className="block text-gray-700">Adjuster Email</label>
        <input
          placeholder="Select the adjuster"
          className="border border-gray-300 focus:border-none mt-2 focus:ring-0 rounded-lg bg-gray-200 block w-full p-2.5 mb-3"
          {...register("adjuster_email")}
          readOnly
        />
      </div>
      {/* <div className="mb-4">
        <label className="block text-gray-700">Adjuster Phone</label>
        <input
          placeholder="Adjuster's phone number"
          className="border border-gray-300 focus:border-none mt-2 focus:ring-0 rounded-lg block w-full p-2.5 mb-3"
          {...register("adjuster_phone")}
        />
      </div> */}
      <div className="mb-4 hidden">
        <label className="block text-gray-700">Adjuster Name</label>
        <input
          className="border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-3"
          {...register("adjuster_name")}
          readOnly
        />
      </div>
    </div>
  );
};

export default Assignment;

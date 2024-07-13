"use client";
import React, { useEffect } from "react";
import { getReportData } from "@/functions/get-report-data";

export default function Page() {
  useEffect(() => {
    const fetch = async () => {
      const reportData= await getReportData('666b37bac95435991032');
      console.log(reportData);
    };
    fetch();
  }, []);

  return <div>page</div>;
}

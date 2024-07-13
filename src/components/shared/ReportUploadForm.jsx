"use client";
import React, { useEffect, useState } from "react";
import useIsCurrentAdjusterClaim from "@/hooks/useIsCurrentAdjusterClaim";
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/Loader";
import { getReportData } from "@/functions/get-report-data";
import { toast } from "@/components/ui/use-toast";
import {
  CreateDocument,
  GetDocumentByDocId,
  UpdateDocument,
} from "@/cms/DatabaseHelpers/database-helper";
import { emailSender } from "@/functions/send-email";
import reportMail from "@/components/email-templates/ReportMail";

const ReportUploadForm = ({ params }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file
  const { isCurrentAdjusterClaim, loading } = useIsCurrentAdjusterClaim(
    params?.id
  );
  const {
    currentUser,
    isUserLoggedIn,
    isLoading: isAuthLoading,
  } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const fetchDefaultValues = async () => {
      const res = await GetDocumentByDocId(
        process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
        process.env.NEXT_PUBLIC_VNG_CLAIMS,
        params?.id
      );
      const reportData = await getReportData(params?.id);
      setReportData(reportData);
      setFetchedData(res?.data);
    };
    fetchDefaultValues();
  }, [params?.id]);

  useEffect(() => {
    if (!isAuthLoading && !isUserLoggedIn) {
      router.push("/login");
    }
  }, [isAuthLoading, isUserLoggedIn, router]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const form = e.target;
    const email = form.email.value;
    const claimNumber= form.vanguard_claim_number.value;
    const fileUpload = form.fileUpload.files[0];
    if (!email || !fileUpload) {
      setIsSubmitting(false);
      alert("Please provide all the required information.");
      return;
    }

    const reportFormData = {
      reportEmail: email,
      reportAdjusterEmail: currentUser.email,
      reportData: reportData,
    };

    const requestBody = new FormData();
    requestBody.append("json", JSON.stringify(reportFormData));
    requestBody.append("file", fileUpload);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ITEX_API_ENDPOINT}/vanguard/GenerateReport?id=${params.id}`,
        {
          method: "POST",
          headers: {
            "X-API-Key": process.env.NEXT_PUBLIC_ITEX_API_KEY,
          },
          body: requestBody,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData || response.statusText);
        alert(
          "There was an error generating the report. See browser console for details."
        );
        setIsSubmitting(false);
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      const emailHtml = await reportMail(claimNumber, result.response);
      const res = await emailSender(
        email,
        emailHtml,
        `Claim #${claimNumber} report has been generated`,
      );
      // console.log(res);
      const updateRes = await UpdateDocument(
        process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
        process.env.NEXT_PUBLIC_VNG_CLAIMS,
        params.id,
        { status: "Report Generated", reportFileURL: result.response }
      );
      if (updateRes.success) {
        setIsSubmitting(false);
        toast({
          title: "Report generated successfully.",
        });
        router.push("/claims");
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error:", error);
      alert("There was an error generating the report.");
    }
  };

  if (loading || !fetchedData) {
    return <LoadingScreen />;
  } else if (!isCurrentAdjusterClaim) {
    return (
      <div className="text-red-600 p-4">
        <p>You are not authorized to view this Report upload page</p>
      </div>
    );
  } else {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Report upload</h2>
        <p className="mb-4">
          Welcome to the Vanguard report generation tool. Please follow the
          instructions below to generate a report.
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>
            Provide the email address for where you want to send the completed
            report
          </li>
          <li>
            Upload a copy of the partially completed report from Xactimate in
            Word (.doc/.docx) format
          </li>
        </ul>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="vanguard_claim_number"
            >
              Vanguard claim number *
            </label>
            <input
              type="text"
              id="vanguard_claim_number"
              name="vanguard_claim_number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              readOnly={true}
              value={fetchedData?.vanguard_claim_number || ""}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
              defaultValue={currentUser.email}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="fileUpload"
            >
              Report Upload
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="fileUpload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center py-7">
                  <svg
                    className="w-8 h-8 text-gray-500 mb-3"
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    dataName="Layer 1"
                    viewBox="0 0 99.09 122.88"
                  >
                    <title>file-upload</title>
                    <path d="M64.64,13,86.77,36.21H64.64V13ZM42.58,71.67a3.25,3.25,0,0,1-4.92-4.25l9.42-10.91a3.26,3.26,0,0,1,4.59-.33,5.14,5.14,0,0,1,.4.41l9.3,10.28a3.24,3.24,0,0,1-4.81,4.35L52.8,67.07V82.52a3.26,3.26,0,1,1-6.52,0V67.38l-3.7,4.29ZM24.22,85.42a3.26,3.26,0,1,1,6.52,0v7.46H68.36V85.42a3.26,3.26,0,1,1,6.51,0V96.14a3.26,3.26,0,0,1-3.26,3.26H27.48a3.26,3.26,0,0,1-3.26-3.26V85.42ZM99.08,39.19c.15-.57-1.18-2.07-2.68-3.56L63.8,1.36A3.63,3.63,0,0,0,61,0H6.62A6.62,6.62,0,0,0,0,6.62V116.26a6.62,6.62,0,0,0,6.62,6.62H92.46a6.62,6.62,0,0,0,6.62-6.62V39.19Zm-7.4,4.42v71.87H7.4V7.37H57.25V39.9A3.71,3.71,0,0,0,61,43.61Z" />
                  </svg>
                  <p className="text-sm text-gray-500">
                    {selectedFile ? selectedFile.name : "Drag files here to upload"}
                  </p>
                  <p className="text-xs text-gray-500">or</p>
                  <p className="text-sm text-blue-500 underline">
                    Add from computer
                  </p>
                </div>
                <input
                  id="fileUpload"
                  name="fileUpload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-primary hover:opacity-90 text-white w-full rounded-md text-sm font-medium py-2 px-4 focus:outline-none focus:shadow-outline flex gap-2 justify-center items-center"
            >
              {isSubmitting ? (
                <div className="loader"></div>
              ) : "Submit"}
            </button>
          </div>
        </form>
      </div>
    );
  }
};

export default ReportUploadForm;
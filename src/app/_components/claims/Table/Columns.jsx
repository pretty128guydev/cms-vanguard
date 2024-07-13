"use client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { AiOutlineEdit } from "react-icons/ai";

const columnsBase = [
  {
    accessorKey: "location_of_loss",
    header: "Address",
  },
  {
    accessorKey: "main_contact_first_name",
    header: "First name",
  },
  {
    accessorKey: "main_contact_last_name",
    header: "Last Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      let statusColor = "";
  
      switch (status) {
        case "New":
          statusColor = "text-red-600";
          break;
        case "Inspection Completed":
          statusColor = "text-blue-600";
          break;
        case "Report Generated":
          statusColor = "text-green-600";
          break;
        default:
          statusColor = "text-gray-600"; // Optional: Default color for other statuses
      }
  
      return <p className={`${statusColor} font-semibold`}>{status}</p>;
    },
  },
  {
    accessorKey: "carrier_claim_number",
    header: "Carrier Claim",
  },
  {
    accessorKey: "vanguard_claim_number",
    header: "Vanguard Claim",
  },
  {
    accessorKey: "carrier_policy_number",
    header: "Policy",
  },
  {
    accessorKey: "date_of_loss",
    header: "Date of Loss",
  },
  {
    accessorKey: "adjuster_name",
    header: "Inspection",
  },
];


const actionColumnAdmin={
  accessorKey: null,
  header: "Action",
  cell: ({ row }) => {
    const status = row.getValue("status");
    const reportFileURL = row.original.reportFileURL;
    // if (status === "Report Generated" && reportFileURL) {
    if (reportFileURL !== null) {
      return (
        <button
          onClick={() => {
            window.open(reportFileURL, "_blank"); // Open in a new tab
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 text-xs py-1 rounded-sm"
        >
          Download Report
        </button>
      );
    }
  },
}

const actionColumn = {
  accessorKey: null,
  header: "Action",
  cell: ({ row }) => {
    const status = row.getValue("status");
    const reportFileURL = row.original.reportFileURL;
    if (status === "New") {
      return null;
    }
    if (status === "Report Generated" && reportFileURL !== null) {
    // if (reportFileURL !== null) {
      return (
        <>
        <button
          onClick={() => {
            window.open(reportFileURL); // Open in a new tab
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 text-xs py-1 rounded-sm"
        >
          Download Report
        </button>
        </>
      );
    }
    const url = `/claims/generate-report/${row.original.$id}`;
    return (
      <button
        onClick={() => {
          window.open(url, "_blank"); // Open in a new tab
        }}
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-2 text-xs py-1 rounded-sm"
      >
        Generate Report
      </button>
    );
  },
};

export const columns = (isAdjuster, isAdmin, isSuperAdmin) => {
  if (isAdjuster) {
    return [...columnsBase, actionColumn];
  }else if(isAdmin || isSuperAdmin){
    return [...columnsBase, actionColumnAdmin];
  }
  return columnsBase;
};

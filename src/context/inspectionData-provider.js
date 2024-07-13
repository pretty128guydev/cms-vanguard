"use client";
const { createContext, useContext, useState, useEffect } = require("react");
import { GetDocuments } from "@/cms/DatabaseHelpers/database-helper";
import { useParams } from "next/navigation";

const InspectionDataContext = createContext({ data: [], loading: true });

export const useInspectionDataContext = () => {
  return useContext(InspectionDataContext);
};

const InspectionDataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimData, setClaimData] = useState({});
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    const getFormQuestions = async () => {
      let value;
      const dataRes = await GetDocuments(
        process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
        process.env.NEXT_PUBLIC_VNG_CLAIMS,
        "$id",
        id
      );
      if (dataRes?.data?.documents) {
        value = dataRes.data.documents[0];
        setClaimData(value);
      }
      const questions = await GetDocuments(
        process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
        process.env.NEXT_PUBLIC_VNG_FORM_QUESTIONS_ADJUSTER,
        "enabled", // No matcher used
        true, // No query used
        "DisplayOrder" // Ordering by 'field_order'
      );
      const sanitizedData = questions?.data?.documents.map((item) => {
        return {
          ...item,
          FieldValue: value[item?.FieldName] ? value[item?.FieldName] : null,
        };
      });
      setData(sanitizedData);
    };
    getFormQuestions();
    setLoading(false);
  }, [id]);
  const ctxValue = { data, loading, claimData };
  return (
    <InspectionDataContext.Provider value={ctxValue}>
      {children}
    </InspectionDataContext.Provider>
  );
};

export default InspectionDataProvider;

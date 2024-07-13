"use client";
const { createContext, useContext, useState, useEffect } = require("react");
import { GetDocuments } from "@/cms/DatabaseHelpers/database-helper";

const ClaimDataContext = createContext({data:[], loading: true});

export const useClaimDataContext = () => {
  return useContext(ClaimDataContext);
};

const ClaimDataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    setLoading(true);
    const getFormQuestions = async() => {
        const questions = await GetDocuments(
          process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
          process.env.NEXT_PUBLIC_VNG_FORM_QUESTIONS_ADMIN,
          "enabled", // No matcher used
          true, // No query used
          "field_order" // Ordering by 'field_order'
        );
        setData(questions?.data?.documents);
    }
    getFormQuestions();
    setLoading(false);
  },[])
  const ctxValue = {data, loading};
  return (
    <ClaimDataContext.Provider value={ctxValue}>
      {children}
    </ClaimDataContext.Provider>
  );
};

export default ClaimDataProvider;

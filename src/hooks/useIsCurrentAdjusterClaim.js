"use client"
import { GetDocumentByDocId } from '@/cms/DatabaseHelpers/database-helper';
import { useAuthContext } from '@/context/auth-provider';
import React, { useEffect, useState } from 'react';

const useIsCurrentAdjusterClaim = (docID) => {
  const [isCurrentAdjusterClaim, setIsCurrentAdjusterClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuthContext();
  const userId = currentUser?.$id;

  useEffect(() => {
    const getIsCurrentAdjuster = async () => {
      setLoading(true);
      try {
        const res = await GetDocumentByDocId(process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB, process.env.NEXT_PUBLIC_VNG_CLAIMS, docID);
        if (res && userId) {
          if (!res.data) {
            setIsCurrentAdjusterClaim(false);
          } else {
            setIsCurrentAdjusterClaim(res.data.adjusterId === userId);
          }
        } else {
          setIsCurrentAdjusterClaim(false);
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        setIsCurrentAdjusterClaim(false);
      } finally {
        setLoading(false);
      }
    };

    if (docID && userId) {
      getIsCurrentAdjuster();
    }
  }, [docID, userId]);

  return { isCurrentAdjusterClaim, loading };
};

export default useIsCurrentAdjusterClaim;

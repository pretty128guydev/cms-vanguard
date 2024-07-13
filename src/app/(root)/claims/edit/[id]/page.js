"use client"
import ClaimCreateWrapper from '@/app/_components/claims/ClaimCreateWrapper'
import { GetDocumentByDocId } from '@/cms/DatabaseHelpers/database-helper'
import ProtectRoute from '@/components/shared/ProtectRoute'
import { useAuthContext } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/shared/Loader";
import React, { useEffect, useState } from 'react';

const Edit = ({ params }) => {
  const { isUserLoggedIn, isLoading: isAuthLoading } = useAuthContext();
  const router = useRouter();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await GetDocumentByDocId(
          process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB, 
          process.env.NEXT_PUBLIC_VNG_CLAIMS,
          params?.id
        );
        setDocument(res.data);
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params?.id]);
  console.log(params?.id);

  useEffect(() => {
    if (!isAuthLoading && !isUserLoggedIn) {
      router.push("/login");
    }
  }, [isAuthLoading, isUserLoggedIn, router]);

  if (isAuthLoading || loading) {
    return <LoadingScreen showLabel={true} label="Checking user status" />;
  }

  if (!document) {
    return (
      <div className='p-4 text-red-600'>
        <p>Invalid Link</p>
      </div>
    );
  }

  return (
    <div>
      <ProtectRoute enableAuthorization={true}>
        <ClaimCreateWrapper type="edit" document={document} />
      </ProtectRoute>
    </div>
  );
};

export default Edit;

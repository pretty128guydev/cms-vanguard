import { GetDocuments } from '@/cms/DatabaseHelpers/database-helper';
import { useAuthContext } from '@/context/auth-provider'
import React, { useEffect, useState } from 'react'

const useCurrentAdjusterClaims = () => {
    const {isAdmin, isSuperAdmin, isAdjuster, currentUser, isUserLoggedIn, userLoading} = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [currentAdjusterClaims, setCurrentAdjusterClaims] = useState([]);
    useEffect(()=>{
        setLoading(true);
        const getClaims = async() => {
            const allClaims = await GetDocuments(process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB, process.env.NEXT_PUBLIC_VNG_CLAIMS, isAdjuster ? 'adjusterId' : null, isAdjuster ? currentUser?.$id : null);
            setCurrentAdjusterClaims(currentUser ? allClaims?.data?.documents : [])
        }
        setLoading(false);
        getClaims();
    },[userLoading, currentUser, isAdjuster])

    return [currentAdjusterClaims, loading];
}

export default useCurrentAdjusterClaims

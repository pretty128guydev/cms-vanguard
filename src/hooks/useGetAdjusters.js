"use client"
import { team } from '@/cms/cms.config';
import React, { useEffect, useState } from 'react'

const useGetAdjusters = () => {
    const [allAdjusters, setAllAdjusters] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        setLoading(true);
        const getAdjusters = async()=>{
            try {
                const result = await team.listMemberships(
                    process.env.TeamIdAdjuster
                );
                console.log(result);
                setAllAdjusters(result.memberships);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
            }
        }
        getAdjusters();
        setLoading(false);
    },[])

    return {allAdjusters, loading};
}

export default useGetAdjusters

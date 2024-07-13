"use client"
import { useAuthContext } from '@/context/auth-provider'
import React from 'react'
import LoadingScreen from './Loader';

const ProtectRoute = ({enableAuthorization, children}) => {
    const { isAdmin, isSuperAdmin , isUserLoggedIn, isLoading, isAdjuster } = useAuthContext();
    // console.log("isAdmin", isAdmin);
    // console.log("isSuperAdmin", isSuperAdmin);
    // console.log("isAdjuster", isAdjuster);
    if (isUserLoggedIn) {
        if(enableAuthorization && (isAdmin || isSuperAdmin)){
            return children;
        }else if(enableAuthorization && (!isAdmin&&!isSuperAdmin)){
            // eslint-disable-next-line react/no-unescaped-entities
            return <div className='p-4 text-red-500'>You don't have access to this page</div>
        }else return children
    } 
    if(!isUserLoggedIn){
        if(isLoading){
            return <LoadingScreen />
        // eslint-disable-next-line react/no-unescaped-entities
        }else return <div className='p-4 text-red-500'>You don't have access to this page</div>
    }
}

export default ProtectRoute

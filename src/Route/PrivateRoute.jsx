
import React from 'react'
import useAuth from '../Hook/useAuth'
import { Navigate, useLocation } from 'react-router'
import WebsiteLoading from '../Shared/Loading/WebsiteLoading'

const PrivateRoute = ({children}) => {
    const {user , loading} = useAuth()
    const location = useLocation();

    if(loading){
        return <WebsiteLoading />
    }
    if(!user){
        return <Navigate to='/login' state={{from: location}} replace></Navigate>
    }
  return children
}

export default PrivateRoute
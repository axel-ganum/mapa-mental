import React from 'react'
import { Route,Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({element}) => {
    const isAuthrnticated = !!localStorage.getItem('token')
  return isAuthrnticated ? element : <Navigate to= '/login'/>
}

export default ProtectedRoute

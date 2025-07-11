import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

const ProtectedRoute = ({children, role}) => {
    const adminToken = Cookies.get('AdminToken');
    const employeeToken = Cookies.get('EmployeeToken');
    if( role === 'admin' && !adminToken ) return <Navigate to='/' replace />;
    if( role === 'employee' && !employeeToken ) return <Navigate to='/' replace />;

  return children
}

export default ProtectedRoute
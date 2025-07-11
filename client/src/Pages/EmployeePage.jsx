import React from 'react'
import { Outlet } from 'react-router-dom'
import EmployeeNav from '../Components/EmployeeNav'

const EmployeePage = () => {
  return (
    <div>
        <EmployeeNav />
        <Outlet />
    </div>
  )
}

export default EmployeePage
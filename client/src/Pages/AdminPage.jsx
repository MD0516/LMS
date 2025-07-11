import React from 'react'
import AdminNav from '../Components/AdminNav'
import { Outlet } from 'react-router-dom'

const AdminPage = () => {
  return (
    <div>
        <AdminNav />
        <Outlet />
    </div>
  )
}

export default AdminPage
import { createBrowserRouter } from "react-router-dom";
import { createTheme } from "@mui/material";
import HomePage from "../Pages/HomePage";
import AdminPage from "../Pages/AdminPage";
import ChangePassword from "../Components/Admin/ChangePassword";
import Dashboard from "../Components/Admin/Dashboard";
import Department from "../Components/Admin/Department";
import Employees from "../Components/Admin/Employees";
import LeaveManagement from "../Components/Admin/LeaveManagement";
import LeaveType from "../Components/Admin/LeaveType";
import EmployeePage from "../Pages/EmployeePage";
import EmpDashboard from "../Components/Employee/Dashboard";
import EmpChangePassword from "../Components/Employee/EmpChangePassword";
import Leaves from "../Components/Employee/Leaves";
import AdminRegister from "../Components/AdminRegister";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage></HomePage>,
  },
  {
    path: "/admin-dashboard",
    element: <AdminPage></AdminPage>,
    children: [
      {
        index: true,
        element: <Dashboard></Dashboard>,
      },
      {
        path: "department",
        element: <Department></Department>,
      },
      {
        path: "leave-type",
        element: <LeaveType></LeaveType>,
      },
      {
        path: "employees",
        element: <Employees></Employees>,
      },
      {
        path: "leave-management",
        element: <LeaveManagement></LeaveManagement>,
      },
      {
        path: "change-password",
        element: <ChangePassword></ChangePassword>,
      },
    ],
  },
  {
    path: "/employee-dashboard",
    element: <EmployeePage></EmployeePage>,
    children: [
      {
        index: true,
        element: <EmpDashboard></EmpDashboard>,
      },
      {
        path: "change-password",
        element: <EmpChangePassword></EmpChangePassword>,
      },
      {
        path: "leave-request",
        element: <Leaves></Leaves>,
      },
    ],
  },
  {
    path: '/admin-register',
    element: <AdminRegister></AdminRegister>
  }
]);

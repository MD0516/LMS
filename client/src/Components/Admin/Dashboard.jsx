import {
  Card,
  CardContent,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Button,
  TableBody,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Field, Formik } from "formik";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";

const CustomDropDown = ({ name, label, width, options, labelId }) => (
  <FormControl sx={{ my: 2 }}>
    <InputLabel
      id={labelId}
      sx={{
        color: "#858585",
        "&.Mui-focused": {
          color: "#fff",
        },
      }}
    >
      {label}
    </InputLabel>

    <Field
      name={name}
      as={Select}
      labelId={labelId}
      id={name}
      label={label}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: "#111",
            color: "#fff",
            "& .MuiMenuItem-root": {
              backgroundColor: "#111",
              color: "#fff",
              "&.Mui-selected": {
                backgroundColor: "#000",
              },
              "&.Mui-selected:hover": {
                backgroundColor: "#222",
              },
              "&:hover": {
                backgroundColor: "#222",
              },
            },
          },
        },
      }}
      sx={{
        backgroundColor: "#111",
        color: "#fff",
        width: width,
        ".MuiSvgIcon-root": { color: "#fff" },
        ".MuiOutlinedInput-notchedOutline": {
          borderColor: "#858585",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#fff",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#222",
        },
      }}
    >
      <MenuItem value="">
        <em style={{ color: "#858585" }}>Select</em>
      </MenuItem>
      {options.map((item, i) => (
        <MenuItem key={i} value={item}>
          {item}
        </MenuItem>
      ))}
    </Field>
  </FormControl>
);

const Dashboard = () => {
  const [totalDept, setTotalDept] = useState(null);
  const [totalLeaveType, setTotalLeaveType] = useState(null);
  const [totalEmployees, setTotalEmployees] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/fetch-total-dept")
      .then((res) => setTotalDept(res.data));
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3000/fetch-total-leave-type")
      .then((res) => setTotalLeaveType(res.data));
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:3000/fetch-total-employees")
      .then((res) => setTotalEmployees(res.data));
  }, []);

  const [leaveHistory, setLeaveHistory] = useState([]);

  const fetchLeaveHistory = () => {
    axios
      .get("http://localhost:3000/fetch-pending-leave-history")
      .then((res) => {
        setLeaveHistory(res.data.LeaveData);
      })
      .catch((err) => console.log("Error fetching Emp data form DB", err));
  };

  const [updateForm, setUpdateForm] = useState(false);
  const [fetchEmp, setFetchEmp] = useState([]);
  const fetchEmployeeDetails = (data) => {
    axios
      .get(`http://localhost:3000/fetch-employee-details?id=${data}`, {
        withCredentials: true,
      })
      .then((res) => {
        const merged = res.data.leaveResults.map((leaveItem) => ({
          ...leaveItem,
          ...res.data.empResults[0],
        }));
        setFetchEmp(merged);
      })
      .catch((err) =>
        console.log("Error occurred while fetching emp data : ", err)
      );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#ffc107";
      case "Approved":
        return "#4caf50";
      case "Rejected":
        return "#f44336";
      case "Cancelled":
        return "#9e9e9e";
      default:
        return "#ffffff";
    }
  };

  const getAdminColor = (remark) => {
    switch (remark) {
      case "Pending":
        return "#ffc107";
      case "Insufficient Leave Balance":
      case "Rejected":
        return "#f44336";
      case "Approved as Emergency Leave":
        return "#ff9800";
      case "Reschedule Required":
        return "#2196f3";
      case "Missing Supporting Document":
        return "#9c27b0";
      case "Under Review":
        return "#795548";
      case "Approved":
        return "#4caf50";
      default:
        return "#ffffff";
    }
  };

  const [action, setAction] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const updateAction = (values) => {
    const data = {
      status: values.status,
      adminRemark: values.adminRemark,
      id: selectedId,
    };

    axios
      .post("http://localhost:3000/status-update", data)
      .then((res) => console.log("Update success", res))
      .catch((err) => console.log("Update Error", err));
  };

  const initialValues = {
    status: "",
    adminRemark: "",
  };

  const validationSchema = Yup.object({
    status: Yup.string().required("Required"),
    adminRemark: Yup.string().required("Required"),
  });

  const adminArray = [
    "Pending",
    "Approved",
    "Rejected",
    "Under Review",
    "Insufficient Leave Balance",
    "Approved as Emergency Leave",
    "Reschedule Required",
    "Missing Supporting Document",
  ];
  const statusArray = ["Pending", "Approved", "Rejected", "Cancelled"];

  const onSubmit = (values, { resetForm }) => {
    updateAction(values);
    resetForm();
    fetchLeaveHistory();
    setAction(false);
    setUpdateForm(false);
  };

  useEffect(() => {
    fetchLeaveHistory();
  }, [updateForm]);

  return (
    <div className="mt-5">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="d-flex justify-content-around align-item-center "
      >
        <Card
          sx={{
            minWidth: 350,
            minHeight: 150,
            backgroundColor: "#111",
            color: "#fff",
            border: 1,
            borderColor: "#858585",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "bolder" }}
            >
              Total Employees
            </Typography>
            <Typography
              variant="h2"
              sx={{ textAlign: "center", fontWeight: "bolder", mt: 2 }}
            >
              {totalEmployees}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 350,
            minHeight: 150,
            backgroundColor: "#111",
            color: "#fff",
            border: 1,
            borderColor: "#858585",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "bolder" }}
            >
              Total Departments
            </Typography>
            <Typography
              variant="h2"
              sx={{ textAlign: "center", fontWeight: "bolder", mt: 2 }}
            >
              {totalDept}
            </Typography>
          </CardContent>
        </Card>
        <Card
          sx={{
            minWidth: 350,
            minHeight: 150,
            backgroundColor: "#111",
            color: "#fff",
            border: 1,
            borderColor: "#858585",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              sx={{ textAlign: "center", fontWeight: "bolder" }}
            >
              Total Leave Type
            </Typography>
            <Typography
              variant="h2"
              sx={{ textAlign: "center", fontWeight: "bolder", mt: 2 }}
            >
              {totalLeaveType}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-5 d-flex justify-content-around align-item-center"
      >
        <Card
          sx={{
            backgroundColor: "#111",
            color: "#fff",
            border: 1,
            borderColor: "#858585",
            width: 1300,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", textAlign: "center", my: 3 }}
            >
              Pending Leave Requests
            </Typography>
            <TableContainer>
              <Table>
                <TableRow>
                  <TableCell sx={{ textAlign: "center" }}>SI No</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Employee Name
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Leave Type</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    Posting Date
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>Action</TableCell>
                </TableRow>
                {leaveHistory.length === 0 ? (
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ color: '#fff'}}>
                        No Records Found
                      </TableCell>
                    </TableRow>
                  </TableBody>
                ) : (
                  <TableBody>
                    {leaveHistory.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                          {i + 1}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                          {item.name}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                          {item.leaveType}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                          {item.postingDate}
                        </TableCell>
                        <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                          <Typography
                            sx={{ color: getStatusColor(item.status) }}
                          >
                            {item.status}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ textAlign: "center" }}>
                          <Button
                            onClick={() => {
                              setSelectedId(item.id);
                              fetchEmployeeDetails(item.id);
                              setUpdateForm(true);
                            }}
                          >
                            view details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>
      {updateForm && (
        <div className="popup-bg" onClick={() => setUpdateForm(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  backgroundColor: "#111",
                  color: "#fff",
                  border: 1,
                  borderColor: "#858585",
                  width: 1200,
                  height: 600,
                }}
              >
                <CardContent>
                  <div onClick={() => setUpdateForm(false)}>
                    <CloseIcon />
                  </div>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "center", fontWeight: "bolder", my: 3 }}
                  >
                    LEAVE DETAILS
                  </Typography>
                  <div className="d-flex justify-content-around align-item-center">
                    <TableContainer>
                      <Table>
                        {fetchEmp.map((item, i) => {
                          return (
                            <TableBody key={i}>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Employee Name:
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ color: "#fff" }}>
                                  {item.name}
                                </TableCell>
                                <TableCell colSpan={2}>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Employee ID:
                                  </Typography>
                                </TableCell>
                                <TableCell colSpan={2} sx={{ color: "#fff" }}>
                                  {item.empId}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Gender:
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ color: "#fff" }}>
                                  {item.gender}
                                </TableCell>
                                <TableCell colSpan={2}>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Employee Email Id:
                                  </Typography>
                                </TableCell>
                                <TableCell colSpan={2} sx={{ color: "#fff" }}>
                                  {item.email}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={1}>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Employee Contact No:
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ color: "#fff" }}>
                                  {item.number}
                                </TableCell>
                                <TableCell colSpan={2}>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Leave Type:
                                  </Typography>
                                </TableCell>
                                <TableCell colSpan={2} sx={{ color: "#fff" }}>
                                  {item.leaveType}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Leave Date:
                                  </Typography>
                                </TableCell>
                                <TableCell sx={{ color: "#fff" }}>
                                  {item.from + " - " + item.to}
                                </TableCell>
                                <TableCell colSpan={2}>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Posting Date:
                                  </Typography>
                                </TableCell>
                                <TableCell colSpan={2} sx={{ color: "#fff" }}>
                                  {item.postingDate}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Employee Leave Description:
                                  </Typography>
                                </TableCell>
                                <TableCell colSpan={5} sx={{ color: "#fff" }}>
                                  {item.description}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Leave status:
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  colSpan={5}
                                  sx={{ color: getStatusColor(item.status) }}
                                >
                                  {item.status}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  <Typography
                                    sx={{ fontWeight: "bold", color: "#fff" }}
                                  >
                                    Admin Remark:
                                  </Typography>
                                </TableCell>
                                <TableCell
                                  colSpan={5}
                                  sx={{
                                    color: getAdminColor(item.adminRemark),
                                  }}
                                >
                                  {item.adminRemark}
                                </TableCell>
                              </TableRow>
                              {/* <TableRow>
                              <TableCell>
                                <Typography sx={{ fontWeight: "bold", color: '#fff' }}>
                                  Admin Action Taken Date:
                                </Typography>
                              </TableCell>
                              <TableCell>----</TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontWeight: "bold", color: '#fff' }}
                                ></Typography>
                              </TableCell>
                              <TableCell>----</TableCell>
                              <TableCell>
                                <Typography
                                  sx={{ fontWeight: "bold", color: '#fff' }}
                                ></Typography>
                              </TableCell>
                              <TableCell></TableCell>
                            </TableRow> */}
                            </TableBody>
                          );
                        })}
                      </Table>
                    </TableContainer>
                  </div>
                  <FormControl
                    sx={{ my: 2, mx: 2, display: "flex", alignItems: "center" }}
                  >
                    <Button
                      sx={{
                        color: "#fff",
                        padding: 1,
                        "&:hover": { backgroundColor: "#8f8f8f1e" },
                        "&.Mui-disabled": {
                          color: "rgba(255,255,255,0.5)",
                          backgroundColor: "rgba(255,255,255,0.1)",
                          pointerEvents: "auto",
                          cursor: "not-allowed",
                        },
                      }}
                      type="submit"
                      onClick={() => setAction(true)}
                    >
                      Take Action
                    </Button>
                  </FormControl>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          {action && (
            <div
              className="popup-bg-action"
              onClick={(e) => {
                e.stopPropagation();
                setAction(false);
              }}
            >
              <div className="popup-acton" onClick={(e) => e.stopPropagation()}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    sx={{
                      backgroundColor: "#111",
                      color: "#fff",
                      border: 1,
                      borderColor: "#858585",
                      width: 600,
                    }}
                  >
                    <CardContent>
                      <div onClick={() => setAction(false)}>
                        <CloseIcon />
                      </div>
                      <Typography
                        variant="h5"
                        sx={{
                          textAlign: "center",
                          fontWeight: "bolder",
                          my: 3,
                        }}
                      >
                        LEAVE TAKE ACTION
                      </Typography>

                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                      >
                        {({ handleSubmit }) => (
                          <form onSubmit={handleSubmit}>
                            <div className="d-flex flex-column justify-content-center align-items-center">
                              <CustomDropDown
                                name="status"
                                label="Status"
                                labelId="statusDrop-down"
                                options={statusArray}
                                width={450}
                              />
                              <CustomDropDown
                                name="adminRemark"
                                label="Admin Remark"
                                labelId="adminDrop-down"
                                options={adminArray}
                                width={450}
                              />
                            </div>

                            <FormControl
                              sx={{
                                my: 2,
                                mx: 2,
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Button
                                sx={{
                                  color: "#fff",
                                  padding: 1,
                                  "&:hover": { backgroundColor: "#8f8f8f1e" },
                                  "&.Mui-disabled": {
                                    color: "rgba(255,255,255,0.5)",
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    pointerEvents: "auto",
                                    cursor: "not-allowed",
                                  },
                                  width: 300,
                                }}
                                type="submit"
                              >
                                Take Action
                              </Button>
                            </FormControl>
                          </form>
                        )}
                      </Formik>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

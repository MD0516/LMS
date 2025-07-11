import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import CloseIcon from "@mui/icons-material/Close";
import EditSharpIcon from "@mui/icons-material/EditSharp";

const LeaveType = () => {
  const [updateLeave, setUpdateLeave] = useState(false);

  const formik = useFormik({
    initialValues: {
      type: "",
      description: "",
      uType: "",
      uDescription: "",
    },
    validationSchema: Yup.object({
      type: !updateLeave
        ? Yup.string().min(3, "Minimum 3 Characters").required("Required")
        : Yup.string(),
      description: !updateLeave
        ? Yup.string().min(3, "Minimum 3 Characters").required("Required")
        : Yup.string(),
      uType: updateLeave
        ? Yup.string().min(3, "Minimum 3 Characters").required("Required")
        : Yup.string(),
      uDescription: updateLeave
        ? Yup.string().min(3, "Minimum 3 Characters").required("Required")
        : Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      {
        updateLeave ? leaveTypeUpdate(values) : addLeaveType(values);
      }
      fetchLeaveType();
      resetForm();
    },
  });

  const leaveType = [
    {
      name: "type",
      label: "Leave Type",
    },
    {
      name: "description",
      label: "Description",
    },
  ];
  const uLeaveType = [
    {
      name: "uType",
      label: "Leave Type",
    },
    {
      name: "uDescription",
      label: "Description",
    },
  ];

  const [isAdd, setIsAdd] = useState(false);
  const [leave, setLeave] = useState([]);

  const addLeaveType = (values) => {
    const data = {
      type: values.type,
      description: values.description,
    };
    axios
      .post("http://localhost:3000/add-leave-type", data)
      .then((res) => {
        console.log("Leave type added", res);
        fetchLeaveType();
      })
      .catch((err) => console.log("Occurred While inserting Data to DB", err));
  };

  const fetchLeaveType = () => {
    axios
      .get("http://localhost:3000/fetch-leave-type")
      .then((res) => {
        setLeave(res.data);
      })
      .catch((err) => {
        console.log("Error Fetching data from DB", err);
      });
  };

  useEffect(() => {
    fetchLeaveType();
  }, []);

  const leaveTypeUpdate = (values) => {
    const data = {
      uType: values.uType,
      uDescription: values.uDescription,
      type: values.type,
    };
    axios
      .post("http://localhost:3000/update-leave-type", data)
      .then((res) => {
        console.log(res);
        fetchLeaveType();
        setUpdateLeave(false);
      })
      .catch((err) => console.log("Occurred while Updating", err));
  };

  return (
    <div>
      <div className="w-100 d-flex justify-content-center ">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="row login-nav my-3 "
        >
          <Button
            sx={{ color: "#fff", borderRadius: 0 }}
            className="col text-center admin-tab"
            onClick={() => setIsAdd(true)}
          >
            <motion.span
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.7, ease: "linear" }}
              whileTap={{ scale: 0.8, duration: 0.1 }}
            >
              Add Leave Type
            </motion.span>
          </Button>
          <Button
            sx={{ color: "#fff" }}
            className="col text-center employee-tab"
            onClick={() => setIsAdd(false)}
          >
            <motion.span
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 50, opacity: 0 }}
              transition={{ duration: 0.7, ease: "linear" }}
              whileTap={{ scale: 0.8, duration: 0.1 }}
            >
              Manage Leave Type
            </motion.span>
          </Button>
        </motion.div>
      </div>
      {isAdd ? (
        <motion.div
          key="add"
          initial={{ y: -100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-5 d-flex justify-content-around align-item-center"
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
              <Typography
                variant="h5"
                sx={{ textAlign: "center", fontWeight: "bolder", my: 3 }}
              >
                ADD LEAVE TYPE
              </Typography>
              <div className="d-flex justify-content-around align-item-center">
                <form onSubmit={formik.handleSubmit}>
                  {leaveType.map((item, i) => {
                    const hasError =
                      formik.touched[item.name] &&
                      Boolean(formik.errors[item.name]);
                    return (
                      <div>
                        <FormControl key={i} error={hasError} sx={{ my: 2 }}>
                          <InputLabel
                            sx={{
                              color: "#858585",
                              "&.Mui-focused": {
                                color: `${hasError ? "red" : "#fff"}`,
                              },
                            }}
                            htmlFor="departmentCode"
                          >
                            {item.label}
                          </InputLabel>
                          <Input
                            type="text"
                            value={formik.values[item.name]}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name={item.name}
                            sx={{
                              color: "#fff", // input text color
                              "&:before": {
                                borderBottomColor: `${
                                  hasError ? "red" : "#858585"
                                }`, // Default underline
                              },
                              "&:after": {
                                borderBottomColor: `${
                                  hasError ? "red" : "#858585"
                                }`, // Focused underline
                              },
                              "&:hover:not(.Mui-disabled):before": {
                                borderBottomColor: `${
                                  hasError ? "red" : "#858585"
                                }`, // Hover underline
                              },
                              width: 500,
                            }}
                          />
                          {hasError && (
                            <div className="error">
                              <FormHelperText>
                                {formik.errors[item.name]}
                              </FormHelperText>
                            </div>
                          )}
                        </FormControl>
                      </div>
                    );
                  })}
                  <div className="mt-5 d-flex justify-content-around align-item-center">
                    <FormControl sx={{ my: 1 }}>
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
                        disabled={!formik.isValid || formik.isSubmitting}
                      >
                        add
                      </Button>
                    </FormControl>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="manage"
          initial={{ y: -100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-5 d-flex justify-content-around align-item-center"
        >
          <Card
            sx={{
              backgroundColor: "#111",
              color: "#fff",
              border: 1,
              borderColor: "#858585",
              width: 1500,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", fontWeight: "bolder", my: 3 }}
              >
                MANAGE LEAVE TYPE
              </Typography>
              <div>
                <TableContainer>
                  <Table>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>SI No</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Leave Type
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Creation Date
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>Action</TableCell>
                    </TableRow>
                    {leave.length === 0 ? (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            align="center"
                            sx={{ color: "#fff" }}
                          >
                            No Records Found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : (<TableBody>
                      {leave.map((item, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell sx={{ textAlign: "center", color: '#fff' }}>
                              {i + 1}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", color: '#fff' }}>
                              {item.leaveType}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", color: '#fff' }}>
                              {item.description}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center", color: '#fff' }}>
                              {item.creationDate}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              <Button
                                color="success"
                                onClick={() => {
                                  formik.setValues({
                                    uType: item.leaveType,
                                    uDescription: item.description,
                                    type: item.leaveType,
                                  });
                                  setUpdateLeave(true);
                                }}
                              >
                                <EditSharpIcon />
                              </Button>
                              <Button
                                variant="text"
                                color="error"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to Delete this Leave Type ? "
                                    )
                                  ) {
                                    axios
                                      .post(
                                        "http://localhost:3000/delete-leave-type",
                                        {
                                          type: item.leaveType,
                                        }
                                      )
                                      .then((res) => {
                                        console.log(
                                          "Leave Type Delete Success"
                                        );
                                        fetchLeaveType();
                                      })
                                      .catch((err) => {
                                        console.log({
                                          Error: "Department Deletion Failed",
                                          err,
                                        });
                                      });
                                  }
                                }}
                              >
                                <DeleteForeverSharpIcon />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>)}
                  </Table>
                  <Typography sx={{ my: 2 }}></Typography>
                </TableContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      {updateLeave && (
        <div className="popup-bg" onClick={() => setUpdateLeave(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <motion.div
              key="add"
              initial={{ y: -100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-5 d-flex justify-content-around align-item-center"
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
                  <div onClick={() => setUpdateForm(false)}>
                    <CloseIcon />
                  </div>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "center", fontWeight: "bolder", my: 3 }}
                  >
                    UPDATE LEAVE TYPE
                  </Typography>
                  <div className="d-flex justify-content-around align-item-center">
                    <form onSubmit={formik.handleSubmit}>
                      {uLeaveType.map((item, i) => {
                        const hasError =
                          formik.touched[item.name] &&
                          Boolean(formik.errors[item.name]);
                        return (
                          <div>
                            <FormControl
                              key={i}
                              error={hasError}
                              sx={{ my: 2 }}
                            >
                              <InputLabel
                                sx={{
                                  color: "#858585",
                                  "&.Mui-focused": {
                                    color: `${hasError ? "red" : "#fff"}`,
                                  },
                                }}
                                htmlFor="departmentCode"
                              >
                                {item.label}
                              </InputLabel>
                              <Input
                                type="text"
                                value={formik.values[item.name]}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name={item.name}
                                sx={{
                                  color: "#fff", // input text color
                                  "&:before": {
                                    borderBottomColor: `${
                                      hasError ? "red" : "#858585"
                                    }`, // Default underline
                                  },
                                  "&:after": {
                                    borderBottomColor: `${
                                      hasError ? "red" : "#858585"
                                    }`, // Focused underline
                                  },
                                  "&:hover:not(.Mui-disabled):before": {
                                    borderBottomColor: `${
                                      hasError ? "red" : "#858585"
                                    }`, // Hover underline
                                  },
                                  width: 500,
                                }}
                              />
                              {hasError && (
                                <div className="error">
                                  <FormHelperText>
                                    {formik.errors[item.name]}
                                  </FormHelperText>
                                </div>
                              )}
                            </FormControl>
                          </div>
                        );
                      })}
                      <div className="mt-5 d-flex justify-content-around align-item-center">
                        <FormControl sx={{ my: 1 }}>
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
                            disabled={!formik.isValid || formik.isSubmitting}
                          >
                            update
                          </Button>
                        </FormControl>
                      </div>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveType;

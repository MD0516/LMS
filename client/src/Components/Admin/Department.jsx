import { useEffect, useState } from "react";
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
import EditSharpIcon from "@mui/icons-material/EditSharp";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import CloseIcon from "@mui/icons-material/Close";

const Department = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [newDept, setNewDept] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);
  const deptAdd = (values) => {
    const data = {
      dCode: values.dCode,
      dName: values.dName,
      dShortName: values.dShortName,
    };
    axios
      .post("http://localhost:3000/add-dept", data)
      .then((res) => {
        fetchDepartments();
      })
      .catch((err) => {
        if (err.code === "ER_DUP_ENTRY") {
          alert("Department Code Exists!");
        } else {
          console.log(err);
        }
      });
  };
  const deptUpdate = (values) => {
    const data = {
      uCode: values.uCode,
      uName: values.uName,
      uShortName: values.uShortName,
      dCode: values.dCode,
    };
    axios
      .post("http://localhost:3000/update-dept", data)
      .then((res) => {
        fetchDepartments();
        setUpdateForm(false)
      })
      .catch((err) => {
        if (err.code === "ER_DUP_ENTRY") {
          alert("Department Code Exists!");
        } else {
          console.log(err);
        }
      });
  };
  const addDept = [
    {
      name: "dCode",
      label: "Enter Department Code",
    },
    {
      name: "dName",
      label: "Enter Department Name",
    },
    {
      name: "dShortName",
      label: "Enter Department Short Name",
    },
  ];
  const updateDept = [
    {
      name: "uCode",
      label: "Enter Department Code",
    },
    {
      name: "uName",
      label: "Enter Department Name",
    },
    {
      name: "uShortName",
      label: "Enter Department Short Name",
    },
  ];
  const formik = useFormik({
    initialValues: {
      dCode: "",
      dName: "",
      dShortName: "",
      uCode: "",
      uName: "",
      uShortName: "",
    },
    validationSchema: Yup.object({
      dCode: !updateForm
        ? Yup.string().min(3, "Minimum 3 Characters").required("Required")
        : Yup.string(),
      dName: !updateForm ? Yup.string().required("Required") : Yup.string(),
      dShortName: !updateForm
        ? Yup.string().required("Required")
        : Yup.string(),
      uCode: updateForm
        ? Yup.string().min(3, "Minimum 3 Characters").required("Required")
        : Yup.string(),
      uName: updateForm ? Yup.string().required("Required") : Yup.string(),
      uShortName: updateForm ? Yup.string().required("Required") : Yup.string(),
    }),
    onSubmit: (values, { resetForm }) => {
      {
        updateForm ? deptUpdate(values) : deptAdd(values);
      }
      resetForm();
    },
  });

  const fetchDepartments = () => {
    axios
      .get("http://localhost:3000/fetch-dept")
      .then((res) => {
        setNewDept(res.data);
      })
      .catch((err) => {
        console.log("Error Fetching data from DB", err);
      });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);
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
              Add Department
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
              Manage Department
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
                ADD DEPARTMENT
              </Typography>
              <div className="d-flex justify-content-around align-item-center">
                <form onSubmit={formik.handleSubmit}>
                  {addDept.map((item, i) => {
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
                MANAGE DEPARTMENTS
              </Typography>
              <div>
                <TableContainer>
                  <Table>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>SI No</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Department Code
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Department Name
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Department Short Name
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Creation Date
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>Action</TableCell>
                    </TableRow>
                    {newDept.length === 0 ? (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            align="center"
                            sx={{ color: "#fff" }}
                          >
                            No Records Found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : (
                      <TableBody>
                        {newDept.map((item, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                                {i + 1}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                                {item.departmentCode}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                                {item.departmentName}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                                {item.departmentShortName}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                                {item.creationDate}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", color: "#fff" }}>
                                <Button
                                  color="success"
                                  onClick={() => {
                                    formik.setValues({
                                      uCode: item.departmentCode,
                                      uName: item.departmentName,
                                      uShortName: item.departmentShortName,
                                      dCode: item.departmentCode, // Needed to identify the original code for WHERE clause
                                      dName: "",
                                      dShortName: "",
                                    });
                                    setUpdateForm(true);
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
                                        "Are you sure you want to Delete this Department ? "
                                      )
                                    ) {
                                      axios
                                        .post(
                                          "http://localhost:3000/delete-dept",
                                          { dCode: item.departmentCode }
                                        )
                                        .then((res) => {
                                          console.log(
                                            "Department Delete Success"
                                          );
                                          fetchDepartments();
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
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

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
                    UPDATE DEPARTMENT
                  </Typography>
                  <div className="d-flex justify-content-around align-item-center">
                    <form onSubmit={formik.handleSubmit}>
                      {updateDept.map((item, i) => {
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

export default Department;

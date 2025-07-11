import { useState } from "react";
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
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  TableBody,
  deprecatedPropType,
} from "@mui/material";
import { Formik, ErrorMessage, Field, useField } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          // Label
          "& label": {
            color: "#858585",
          },
          "& label.Mui-focused": {
            color: "#fff",
          },
          "& label.Mui-error": {
            color: "red",
          },

          // Input text
          "& .MuiInputBase-input": {
            color: "#858585",
          },
          "& .MuiInputBase-input.Mui-focused": {
            color: "#fff",
          },
          "& .MuiInputBase-input.Mui-error": {
            color: "red",
          },

          // Calendar icon
          "& .MuiSvgIcon-root": {
            color: "#858585",
          },
          "&.Mui-focused .MuiSvgIcon-root": {
            color: "#fff",
          },
          "&.Mui-error .MuiSvgIcon-root": {
            color: "red",
          },

          // Outline border
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#858585",
          },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "& .Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "red",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#fff",
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "red",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#858585",
          "&.Mui-focused": {
            color: "#fff",
          },
          "&.Mui-error": {
            color: "red",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "red",
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: "#fff",
          "&:hover": {
            backgroundColor: "#222",
          },
        },
        today: {
          border: "1px solid #fff",
        },
        selected: {
          backgroundColor: "#fff",
          color: "#000",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#111",
          color: "#fff",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: "#fff",
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: {
          color: "#fff",
        },
        switchViewButton: {
          color: "#fff",
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          color: "#fff",
        },
      },
    },
  },
});

const initialState = {
  empId: "",
  fName: "",
  lName: "",
  email: "",
  password: "",
  cPassword: "",
  gender: "",
  birthDate: "",
  department: "",
  country: "",
  city: "",
  address: "",
  number: "",
};

const validationSchema = Yup.object({
  empId: Yup.string()
    .min(3, "Employee ID must be at least 3 characters")
    .required("Employee ID is required"),

  fName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(4, "Password must be at least 4 characters")
    .required("Password is required"),

  cPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),

  gender: Yup.string().required("Gender is required"),

  birthDate: Yup.date()
    .max(new Date(), "Birth date cannot be in the future")
    .required("Birth date is required"),

  department: Yup.string().required("Department is required"),

  country: Yup.string().required("Country is required"),

  city: Yup.string().required("City is required"),

  address: Yup.string()
    .min(5, "Address must be at least 5 characters")
    .required("Address is required"),

  number: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
});

const CustomInputField = ({
  name,
  label,
  touched,
  errors,
  type,
  width,
  showToggle = false,
  showPassword = false,
  handlePassword = () => {},
}) => {
  const [field] = useField(name);
  return (
    <FormControl sx={{ my: 3 }} error={touched[name] && Boolean(errors[name])}>
      <InputLabel
        htmlFor={name}
        sx={{
          color: "#858585",
          "&.Mui-focused": {
            color: touched[name] && errors[name] ? "red" : "#fff",
          },
        }}
      >
        {label}
      </InputLabel>

      <Input
        {...field}
        name={name}
        id={name}
        type={showToggle ? (showPassword ? "text" : "password") : type}
        sx={{
          color: "#fff",
          width: width,
          "&:before": {
            borderBottomColor:
              touched[name] && errors[name] ? "red" : "#858585",
          },
          "&:after": {
            borderBottomColor:
              touched[name] && errors[name] ? "red" : "#858585",
          },
          "&:hover:not(.Mui-disabled):before": {
            borderBottomColor:
              touched[name] && errors[name] ? "red" : "#858585",
          },
        }}
        endAdornment={
          showToggle && (
            <InputAdornment position="end">
              <IconButton
                position="end"
                sx={{ color: "#fff" }}
                onClick={handlePassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          )
        }
      />

      <FormHelperText>
        <ErrorMessage name={name} />
      </FormHelperText>
    </FormControl>
  );
};

const CustomDropDown = ({
  name,
  label,
  touched,
  errors,
  width,
  options,
  labelId,
}) => (
  <FormControl sx={{ my: 2 }} error={touched.gender && Boolean(errors.gender)}>
    <InputLabel
      id={labelId}
      sx={{
        color: "#858585",
        "&.Mui-focused": {
          color: touched[name] && errors[name] ? "red" : "#fff",
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
          borderColor: touched[name] && errors[name] ? "red" : "#fff",
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

    <FormHelperText>
      <ErrorMessage name={name} />
    </FormHelperText>
  </FormControl>
);

const CustomDatePicker = ({ name, label }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <FormControl
      sx={{ my: 2, color: "#fff" }}
      error={meta.touched && Boolean(meta.error)}
    >
      <DatePicker
        format="DD/MM/YYYY"
        label={label}
        value={field.value ? dayjs(field.value, "YYYY-MM-DD") : null}
        disableFuture
        onChange={(date) => {
          helpers.setValue(
            date && dayjs(date).isValid() ? date.format("YYYY-MM-DD") : ""
          );
        }}
        sx={{
          color: "#fff",
        }}
        slotProps={{
          textField: {
            variant: "standard",
            sx: {
              input: { color: "#fff" },
              label: { color: "#858585" },
              "& label.Mui-focused": { color: "#fff" },

              // Bottom border colors (underline)
              "& .MuiInput-underline:before": {
                borderBottomColor: "#fff",
              },
              "& .MuiInput-underline:after": {
                borderBottomColor: "#fff",
              },
              "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                borderBottomColor: "#fff",
              },

              // Calendar icon color
              "& .MuiSvgIcon-root": {
                color: "#fff",
              },
              ".MuiSvgIcon-root": { color: "#fff" },
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "#858585",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: meta.touched && meta.error ? "red" : "#fff",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#222",
              },
            },
          },
        }}
      />
      {meta.touched && meta.error && (
        <FormHelperText>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};

const genderArray = ["Male", "Female", "Other"];


const Employees = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showPassword, setShowPassword] = useState({
    password: false,
    cPassword: false,
  });
  const handlePassword = (itemName) => {
    setShowPassword((prev) => ({
      ...prev,
      [itemName]: !prev[itemName],
    }));
  };

  const employeeSubmit = (values, { resetForm }) => {
    const data = {
      empId: values.empId,
      fName: values.fName,
      lName: values.lName,
      email: values.email,
      cPassword: values.cPassword,
      gender: values.gender,
      birthDate: values.birthDate,
      department: values.department,
      country: values.country,
      city: values.city,
      address: values.address,
      number: values.number,
    };
    axios
      .post("http://localhost:3000/employee-register", data)
      .then((res) => {
        fetchEmployees();
        resetForm();
      })
      .catch((err) => console.log(err));
  };

  const fetchEmployees = () => {
    axios
      .get("http://localhost:3000/fetch-employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.log("Error fetching Emp data form DB", err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);
const [deptArray , setDeptArray ] = useState([])

  const fetchDepartments = () => {
    axios
      .get("http://localhost:3000/fetch-dept")
      .then((res) => {
        const deptNames = res.data.map((item) => item.departmentName)
        setDeptArray(deptNames);
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
              Add Employees
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
              Manage Employees
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
              width: 1100,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                sx={{ textAlign: "center", fontWeight: "bolder", my: 4 }}
              >
                ADD EMPLOYEE
              </Typography>
              <div className="d-flex justify-content-around align-items-center">
                <ThemeProvider theme={darkTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Formik
                      initialValues={initialState}
                      validationSchema={validationSchema}
                      onSubmit={employeeSubmit}
                    >
                      {({
                        errors,
                        touched,
                        isSubmitting,
                        isValid,
                        handleSubmit,
                      }) => {
                        return (
                          <form onSubmit={handleSubmit}>
                            <div className="d-flex align-item-center justify-content-between">
                              <div style={{ width: 500 }}>
                                <CustomInputField
                                  name="empId"
                                  label="Employee ID"
                                  type="text"
                                  touched={touched}
                                  errors={errors}
                                  width={450}
                                />
                                <div className="d-flex gap-5">
                                  <CustomInputField
                                    name="fName"
                                    label="First Name"
                                    type="text"
                                    touched={touched}
                                    errors={errors}
                                    width={200}
                                  />
                                  <CustomInputField
                                    name="lName"
                                    label="Last Name"
                                    type="text"
                                    touched={touched}
                                    errors={errors}
                                    width={200}
                                  />
                                </div>
                                <CustomInputField
                                  name="email"
                                  label="E Mail"
                                  type="email"
                                  touched={touched}
                                  errors={errors}
                                  width={450}
                                />
                                <CustomInputField
                                  name="password"
                                  label="Password"
                                  type="password"
                                  touched={touched}
                                  errors={errors}
                                  width={450}
                                  showToggle={true}
                                  showPassword={showPassword.password}
                                  handlePassword={() =>
                                    handlePassword("password")
                                  }
                                />
                                <CustomInputField
                                  name="cPassword"
                                  label="Confirm Password"
                                  type="password"
                                  touched={touched}
                                  errors={errors}
                                  width={450}
                                  showToggle={true}
                                  showPassword={showPassword.cPassword}
                                  handlePassword={() =>
                                    handlePassword("cPassword")
                                  }
                                />
                              </div>

                              <div>
                                <div className="d-flex gap-5">
                                  <CustomDropDown
                                    name="gender"
                                    label="Gender"
                                    options={genderArray}
                                    width={200}
                                    labelId="gender-id"
                                    touched={touched}
                                    errors={errors}
                                  />
                                  <CustomDatePicker
                                    name="birthDate"
                                    label="Date of Birth"
                                    width={200}
                                  />
                                </div>
                                <div className="d-flex gap-5">
                                  <CustomDropDown
                                    name="department"
                                    label="Department"
                                    options={deptArray}
                                    width={200}
                                    labelId="dept-id"
                                    touched={touched}
                                    errors={errors}
                                  />
                                  <CustomInputField
                                    name="country"
                                    label="Country"
                                    width={200}
                                    touched={touched}
                                    errors={errors}
                                  />
                                </div>
                                <div className="d-flex gap-5">
                                  <CustomInputField
                                    name="city"
                                    label="City / Town"
                                    width={200}
                                    touched={touched}
                                    errors={errors}
                                  />
                                  <CustomInputField
                                    name="address"
                                    label="Address"
                                    width={200}
                                    touched={touched}
                                    errors={errors}
                                  />
                                </div>

                                <CustomInputField
                                  name="number"
                                  label="Mobile Number"
                                  width={450}
                                  touched={touched}
                                  errors={errors}
                                />
                                <div>
                                  <FormControl sx={{ my: 5 }}>
                                    <Button
                                      sx={{
                                        color: "#fff",
                                        padding: 1,
                                        "&:hover": {
                                          backgroundColor: "#8f8f8f1e",
                                        },
                                        "&.Mui-disabled": {
                                          color: "rgba(255,255,255,0.5)",
                                          backgroundColor:
                                            "rgba(255,255,255,0.1)",
                                          pointerEvents: "auto",
                                          cursor: "not-allowed",
                                        },
                                      }}
                                      disabled={isSubmitting}
                                      type="submit"
                                    >
                                      add
                                    </Button>
                                  </FormControl>
                                </div>
                              </div>
                            </div>
                          </form>
                        );
                      }}
                    </Formik>
                  </LocalizationProvider>
                </ThemeProvider>
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
                MANAGE EMPLOYEES
              </Typography>
              <div>
                <TableContainer>
                  <Table>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>SI No</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Employee Id
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Employee Name
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Department
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Registered Date
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>Action</TableCell>
                    </TableRow>
                    {employees.length === 0 ? (
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
                    ) : (
                      <TableBody>
                        {employees.map((item, i) => {
                          return (
                            <TableRow key={i}>
                              <TableCell
                                sx={{ textAlign: "center", color: "#fff" }}
                              >
                                {i + 1}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", color: "#fff" }}
                              >
                                {item.empId}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", color: "#fff" }}
                              >
                                {item.fName + " " + item.lName}
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", color: "#fff" }}
                              >
                                {item.department}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography
                                  color={
                                    item.status === "Active"
                                      ? "success"
                                      : "error"
                                  }
                                >
                                  {item.status}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{ textAlign: "center", color: "#fff" }}
                              >
                                {item.creationDate}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Button
                                  variant="text"
                                  color={
                                    item.status === "Active"
                                      ? "error"
                                      : "success"
                                  }
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Are you sure you want to mark this Employee as ${
                                          item.status === "Active"
                                            ? "Inactive"
                                            : "Active"
                                        } ?`
                                      )
                                    ) {
                                      axios
                                        .post(
                                          "http://localhost:3000/status-update-employee",
                                          {
                                            status:
                                              item.status === "Active"
                                                ? "Inactive"
                                                : "Active",
                                            empId: item.empId,
                                          }
                                        )
                                        .then((res) => {
                                          fetchEmployees();
                                        })
                                        .catch((err) => {
                                          console.log({
                                            Error: "Status Update Failed",
                                            err,
                                          });
                                        });
                                    }
                                  }}
                                >
                                  {item.status === "Active" ? (
                                    <CloseIcon />
                                  ) : (
                                    <CheckSharpIcon />
                                  )}
                                </Button>
                                <Button
                                  variant="text"
                                  color="error"
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Are you sure you want to remove this Employee ?`
                                      )
                                    ) {
                                      axios
                                        .post(
                                          "http://localhost:3000/delete-employee",
                                          {
                                            empId: item.empId,
                                          }
                                        )
                                        .then((res) => {
                                          fetchEmployees();
                                        })
                                        .catch((err) => {
                                          console.log({
                                            Error: "Employee Deletion Failed",
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
                  <Typography sx={{ my: 2 }}></Typography>
                </TableContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default Employees;

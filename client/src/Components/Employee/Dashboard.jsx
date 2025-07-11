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
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "@mui/material";
import { Formik, ErrorMessage, Field, useField } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

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

const CustomDatePicker = ({ name, label }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <FormControl
      sx={{ my: 2, color: "#fff" }}
      error={meta.touched && Boolean(meta.error)}
    >
      <DatePicker
        format="DD-MM-YYYY"
        label={label}
        value={field.value ? dayjs(field.value, "DD-MM-YYYY") : null}
        disableFuture
        onChange={(date) => {
          helpers.setValue(
            date && dayjs(date).isValid()
              ? dayjs(date, "DD-MM-YYYY").toDate()
              : ""
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

const validationSchema = Yup.object({
  empId: Yup.string()
    .min(3, "Employee ID must be at least 3 characters")
    .required("Employee ID is required"),

  fName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),

  lName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),

  cPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),

  gender: Yup.string().required("Gender is required"),

  birthDate: Yup.string()
    .required("Date of birth is required")
    .test("is-valid-date", "Invalid date", (value) =>
      dayjs(value, "DD-MM-YYYY", true).isValid()
    ),

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
        <MenuItem key={i} value={item.value}>
          {item.key}
        </MenuItem>
      ))}
    </Field>

    <FormHelperText>
      <ErrorMessage name={name} />
    </FormHelperText>
  </FormControl>
);

const genderArray = [
  { key: "Male", value: "Male" },
  { key: "Female", value: "Female" },
  { key: "Other", value: "Other" },
];

const deptArray = [
  { key: "Accounts", value: "Accounts" },
  { key: "HR", value: "HR" },
  { key: "Marketing", value: "Marketing" },
];

const EmpDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [updateForm, setUpdateForm] = useState(false);

  const fetchEmpDetails = () => {
    axios
      .get("http://localhost:3000/employee-info", { withCredentials: true })
      .then((res) => {
        const formattedData = {
          ...res.data,
          birthDate: dayjs(res.data.birthDate).isValid()
            ? dayjs(res.data.birthDate).format("DD-MM-YYYY")
            : "",
        };
        setData([formattedData]);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error Fetching Employee Info: ", err);
        setLoading(false); // Still hide loading even on error
      });
  };

  useEffect(() => {
    fetchEmpDetails();
  }, []);

  const [formValues, setFormValues] = useState({
    empId: "",
    fName: "",
    lName: "",
    email: "",
    gender: "",
    birthDate: "",
    department: "",
    country: "",
    city: "",
    address: "",
    number: "",
  });

  const empInfoUpdate = (values) => {
    const dataToSend = {
      ...values,
      birthDate: dayjs(values.birthDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
    };

    axios
      .post("http://localhost:3000/update-emp-info", dataToSend)
      .then((res) => {
        console.log("Update successful:", res.data);
        setUpdateForm(false);
        fetchEmpDetails();
      })
      .catch(console.error);
  };

  return (
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
            EMPLOYEE PROFILE
          </Typography>
          <div className="d-flex justify-content-around align-items-center">
            <TableContainer>
              <Table>
                {data.map((item, i) => {
                  return (
                    <TableBody key={i}>
                      <TableRow sx={{ border: 1, borderBottom: 0 }}>
                        <TableCell
                          colSpan={2}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderBottom: 0,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          Employee ID
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderBottom: 0,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          Gender
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderBottom: 0,
                            textAlign: "center",
                          }}
                        >
                          Date of Birth
                        </TableCell>
                      </TableRow>
                      {/* Data Form Database */}
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderLeft: 1,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.empId}
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.gender}
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.birthDate}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderRight: 1,
                            borderLeft: 1,
                            borderBottom: 0,
                            textAlign: "center",
                          }}
                        >
                          First Name
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderRight: 1,
                            borderBottom: 0,
                            textAlign: "center",
                          }}
                        >
                          Last Name
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderRight: 1,
                            borderLeft: 1,
                            borderBottom: 0,
                            textAlign: "center",
                          }}
                        >
                          Department
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderRight: 1,
                            borderBottom: 0,
                            textAlign: "center",
                          }}
                        >
                          Country
                        </TableCell>
                      </TableRow>
                      {/* Data Form Database */}
                      <TableRow>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRight: 1,
                            borderLeft: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.fName}
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.lName}
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRight: 1,
                            borderLeft: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.department}
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.country}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ border: 1, borderBottom: 0 }}>
                        <TableCell
                          colSpan={2}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderBottom: 0,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          Email
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderBottom: 0,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          Address
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderBottom: 0,
                            textAlign: "center",
                          }}
                        >
                          City
                        </TableCell>
                      </TableRow>
                      {/* Data Form Database */}
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderLeft: 1,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.email}
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.address}
                        </TableCell>
                        <TableCell
                          colSpan={1}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.city}
                        </TableCell>
                      </TableRow>
                      <TableRow sx={{ border: 1, borderBottom: 0 }}>
                        <TableCell
                          colSpan={2}
                          sx={{
                            backgroundColor: "#171717",
                            color: "#fff",
                            borderBottom: 0,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          Phone Number
                        </TableCell>
                        <TableCell
                          colSpan={2}
                          rowSpan={2}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderBottom: 1,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          <Button
                            color="success"
                            variant="contained"
                            onClick={() => {
                              setFormValues(item);
                              setUpdateForm(true);
                            }}
                          >
                            update
                          </Button>
                        </TableCell>
                      </TableRow>
                      {/* Data Form Database */}
                      <TableRow>
                        <TableCell
                          colSpan={2}
                          sx={{
                            backgroundColor: "#111",
                            color: "#fff",
                            borderLeft: 1,
                            borderRight: 1,
                            textAlign: "center",
                          }}
                        >
                          {item.number}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  );
                })}
              </Table>
            </TableContainer>
          </div>
        </CardContent>
      </Card>
      {updateForm && (
        <div className="popup-bg" onClick={() => setUpdateForm(false)}>
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
                  width: 1100,
                }}
              >
                <CardContent>
                  <div onClick={() => setUpdateForm(false)}>
                    <CloseIcon />
                  </div>
                  <Typography
                    variant="h5"
                    sx={{ textAlign: "center", fontWeight: "bolder", my: 4 }}
                  >
                    UPDATE EMPLOYEE DETAILS
                  </Typography>
                  <div className="d-flex justify-content-around align-items-center">
                    <ThemeProvider theme={darkTheme}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        {formValues && formValues.empId !== "" && (
                          <Formik
                            initialValues={formValues}
                            // validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={empInfoUpdate}
                          >
                            {({
                              errors,
                              touched,
                              isSubmitting,
                              isValid,
                              dirty,
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
                                        name="number"
                                        label="Mobile Number"
                                        width={450}
                                        touched={touched}
                                        errors={errors}
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
                                      <div className="my-2">
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
                                            disabled={!dirty || isSubmitting}
                                            type="submit"
                                          >
                                            {dirty ? "Update" : "No changes"}
                                          </Button>
                                        </FormControl>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              );
                            }}
                          </Formik>
                        )}
                      </LocalizationProvider>
                    </ThemeProvider>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EmpDashboard;

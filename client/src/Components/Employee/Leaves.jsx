import { useState } from "react";
import { motion } from "framer-motion";
import {
  Button,
  Card,
  CardContent,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  Typography,
  Select,
  MenuItem,
  TableBody,
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

const CustomDatePicker = ({ name, label, width }) => {
  const [field, meta, helpers] = useField(name);
  return (
    <FormControl
      sx={{ my: 2, color: "#fff" }}
      error={meta.touched && Boolean(meta.error)}
    >
      <DatePicker
        format="DD-MM-YYYY"
        label={label}
        value={field.value ? dayjs(field.value) : null}
        onChange={(date) => {
          helpers.setValue(
            date && dayjs(date).isValid() ? dayjs(date).toDate() : null
          );
        }}
        sx={{
          color: "#fff",
        }}
        slotProps={{
          textField: {
            variant: "standard",
            sx: {
              width: width,
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

const initialState = {
  from: null,
  to: null,
  type: "",
  description: "",
};

const validationSchema = Yup.object({
  from: Yup.date()
    .nullable()
    .required("From date is required")
    .typeError("Invalid from date"),
  to: Yup.date()
    .nullable()
    .required("To date is required")
    .min(Yup.ref("from"), "To date cannot be before From date")
    .typeError("Invalid to date"),
  type: Yup.string().required("Leave type is required"),
  description: Yup.string().required("Description is required"),
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

const Leaves = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [leave, setLeave] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);

  const fetchLeaveTypes = () => {
    axios
      .get("http://localhost:3000/fetch-leave-type")
      .then((res) => {
        const leaveTypesArray = res.data.map((item) => item.leaveType.trim());
        setLeaveTypes(leaveTypesArray);
      })
      .catch((err) =>
        console.log("Error while fetching leave types from DB", err)
      );
  };

  useEffect(() => {
    fetchLeaveTypes();
  }, [isAdd]);

  const applyLeave = (values, {resetForm}) => {
    const data = {
      type: values.type,
      to: values.to,
      from: values.from,
      description: values.description,
    };
    axios
      .post("http://localhost:3000/apply-leave", data)
      .then((res) => {
        fetchLeave();
        resetForm();
      })
      .catch((err) => {
        console.log("Apply Leave DB failed", err);
      });
  };

  const fetchLeave = () => {
    axios
      .get("http://localhost:3000/fetch-leave")
      .then((res) => {
        setLeave(res.data.LeaveData);
      })
      .catch((err) => console.log("Error occurred while fetching", err));
  };

  useEffect(() => {
    fetchLeave();
  }, []);

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
              Apply Leave
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
              Leave history
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
                UPDATE EMPLOYEE DETAILS
              </Typography>
              <div className="d-flex justify-content-around align-items-center">
                <ThemeProvider theme={darkTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Formik
                      initialValues={initialState}
                      validationSchema={validationSchema}
                      onSubmit={applyLeave}
                    >
                      {({
                        errors,
                        touched,
                        isSubmitting,
                        isValid,
                        handleSubmit,
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <div className="d-flex flex-column align-item-center justify-content-center">
                            <div className="d-flex justify-content-around gap-5">
                              <CustomDatePicker
                                name="from"
                                label="From"
                                width={400}
                              />
                              <CustomDatePicker
                                name="to"
                                label="To"
                                width={400}
                              />
                            </div>

                            <CustomDropDown
                              name="type"
                              label="Leave Type"
                              options={leaveTypes}
                              width={900}
                              labelId="leaveType-id"
                              touched={touched}
                              errors={errors}
                            />

                            <CustomInputField
                              name="description"
                              label="Description"
                              width={900}
                              touched={touched}
                              errors={errors}
                            />
                          </div>
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
                                disabled={isSubmitting}
                              >
                                Apply leave
                              </Button>
                            </FormControl>
                          </div>
                        </form>
                      )}
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
                LEAVE HISTORY
              </Typography>
              <div>
                <TableContainer>
                  <Table>
                    <TableRow>
                      <TableCell sx={{ textAlign: "center" }}>SI No</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Type of Leave
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>From</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>To</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Posting Date
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Admin Remark
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>status</TableCell>
                    </TableRow>
                    {leave.length === 0 ? (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            align="center"
                            sx={{ color: "#fff" }}
                          >
                            No Records Found
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    ) : (
                      <TableBody>
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
                                {item.from}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", color: '#fff' }}>
                                {item.to}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", color: '#fff' }}>
                                {item.description}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center", color: '#fff' }}>
                                {item.postingDate}
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography
                                  sx={{
                                    color: getAdminColor(item.adminRemark),
                                  }}
                                >
                                  {item.adminRemark}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ textAlign: "center" }}>
                                <Typography
                                  sx={{ color: getStatusColor(item.status) }}
                                >
                                  {item.status}
                                </Typography>
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
    </div>
  );
};

export default Leaves;

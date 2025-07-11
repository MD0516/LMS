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
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const EmpChangePassword = () => {
const formik = useFormik({
    initialValues: {
      cPassword: "",
      nPassword: "",
      rPassword: "",
    },
    validationSchema: Yup.object({
      cPassword: Yup.string().min(4, "Password must be at least 4 characters").required("Required"),
      nPassword: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Required"),
      rPassword: Yup.string()
        .oneOf([Yup.ref("nPassword"), null], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      const data = {
        cPassword: values.cPassword,
        rPassword: values.rPassword,
      };
      axios
        .post("http://localhost:3000/change-employee-password", data)
        .then((res) => {
          if(res.data.Success === "Password Changed Successfully"){
            alert('Password Updated Successfully')
          }
          resetForm();
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.status === 401 &&
            err.response.data.Error === "Old Password is Incorrect"
          ) {
            alert("Please Enter Correct Password");
            resetForm();
          }
        });
    },
  });
  const password = [
    { name: "cPassword", label: "Current Password" },
    { name: "nPassword", label: "New Password" },
    { name: "rPassword", label: "Re-Enter Password" },
  ];
  const [ showPassword, setShowPassword ] = useState({
    cPassword: false,
    nPassword: false,
    rPassword: false,
  });
  const handlePassword = (itemName) => {
    setShowPassword((prev) => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }
  return (
    <div>
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
              sx={{ textAlign: "center", fontWeight: "bolder", my: 4 }}
            >
              CHANGE PASSWORD
            </Typography>
            <div className="d-flex justify-content-around align-item-center">
              <form onSubmit={formik.handleSubmit}>
                {password.map((item, i) => {
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
                          type={showPassword[item.name] ? 'password' : 'text'}
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
                          endAdornment={
                            <InputAdornment position="end" key={i}>
                              <IconButton onClick={() => handlePassword(item.name)} edge='end' sx={{ color: '#fff'}}>
                                { showPassword[item.name] ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
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
                      Change password
                    </Button>
                  </FormControl>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default EmpChangePassword
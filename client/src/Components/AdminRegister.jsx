import { useState } from "react";
import {
  FormControl,
  InputLabel,
  FormHelperText,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import LoginNav from "./LoginNav";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AdminRegister = () => {
  const navigate = useNavigate();
  const adminRegister = (values) => {
    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    axios
      .post("http://localhost:3000/admin-register", data)
      .then((res) => console.log("Admin Registered Successfully", res))
      .catch((err) => {
        if (err.response.data.Error === "Email Exists") {
          alert("Email Id Exits");
        }
        console.log("Admin register Failed", err);
      });
  };
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      email: Yup.string().email("Enter Valid E-mail Id").required("Required"),
      password: Yup.string()
        .min(4, "Minimum 4 Characters")
        .required("Required"),
    }),
    onSubmit: (values, { resetForm }) => {
      adminRegister(values);
      resetForm();
      navigate("/");
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div>
      <div
        className="container login-form py-5 px-1 "
        style={{ width: "400px" }}
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={"admin-register"}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.2 }}
              className="row"
            >
              <div className="col col-12 form-section">
                <form onSubmit={formik.handleSubmit}>
                  <div className="d-flex flex-column">
                    <Link to="/" className="text-decoration-none back">
                      <ArrowBackIcon />
                    </Link>
                    <Typography align="center" sx={{ my: 2 }}>
                      ADMIN REGISTER
                    </Typography>
                    <FormControl
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      sx={{ my: 2 }}
                    >
                      <InputLabel
                        sx={{
                          color: "#858585",
                          "&.Mui-focused": { color: "#fff" },
                        }}
                        htmlFor="name"
                      >
                        Name{" "}
                      </InputLabel>
                      <OutlinedInput
                        sx={{
                          color: "#fff", // input text color
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#858585", // normal border color
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#aaa", // on hover
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#fff", // on focus
                          },
                        }}
                        id="name"
                        label="name"
                        type="text"
                        name="name"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && Boolean(formik.errors.name) && (
                        <FormHelperText>{formik.errors.name}</FormHelperText>
                      )}
                    </FormControl>
                    <FormControl
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      sx={{ my: 2 }}
                    >
                      <InputLabel
                        sx={{
                          color: "#858585",
                          "&.Mui-focused": { color: "#fff" },
                        }}
                        htmlFor="email"
                      >
                        E Mail{" "}
                      </InputLabel>
                      <OutlinedInput
                        sx={{
                          color: "#fff", // input text color
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#858585", // normal border color
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#aaa", // on hover
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#fff", // on focus
                          },
                        }}
                        id="email"
                        label="email"
                        type="email"
                        name="email"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && Boolean(formik.errors.email) && (
                        <FormHelperText>{formik.errors.email}</FormHelperText>
                      )}
                    </FormControl>
                    <FormControl
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      sx={{ my: 2 }}
                    >
                      <InputLabel
                        sx={{
                          color: "#858585",
                          "&.Mui-focused": { color: "#fff" },
                        }}
                        htmlFor="password"
                      >
                        Password
                      </InputLabel>
                      <OutlinedInput
                        sx={{
                          color: "#fff", // input text color
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#858585", // normal border color
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#aaa", // on hover
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#fff", // on focus
                          },
                        }}
                        id="password"
                        label="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        onBlur={formik.handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              onClick={handleClickShowPassword}
                              edge="end"
                              sx={{ color: "#fff" }}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {formik.touched.password &&
                        Boolean(formik.errors.password) && (
                          <FormHelperText>
                            {formik.errors.password}
                          </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl sx={{ my: 4 }}>
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
                        // disabled={ formik.isSubmitting }
                      >
                        register
                      </Button>
                    </FormControl>
                  </div>
                </form>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRegister;

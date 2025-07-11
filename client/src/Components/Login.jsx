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
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const login = useSelector((state) => state.login);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const adminSubmit = (values) => {
    const credentials = {
      email: values.email,
      password: values.password
    }
    axios.post('http://localhost:3000/admin-login', credentials)
     .then( res => {
      console.log(res)
      if(res.data.Status === 'Success') {
        navigate('/admin-dashboard')
      } else if (res.data.Error === 'No Email Existed') {
        alert("Email Id Does'nt Exits Kindly Register")
      } else if (res.data.Error === 'Invalid Credentials') {
        alert('Invalid Credentials')
      }
     })
     .then( err => console.log(err));
  };
  const employeeSubmit = (values) => {
    const credentials = {
      email: values.rEmail,
      password: values.rPassword
    }
    axios.post('http://localhost:3000/employee-login', credentials)
     .then( res => {
      console.log(res)
      if(res.data.Status === 'Success') {
        navigate('/employee-dashboard')
      } else if (res.data.Error === 'No Email Existed') {
        alert("Email Id Does'nt Exits Kindly contact Admin")
      } else if (res.data.Error === 'Invalid Credentials') {
        alert('Invalid Credentials')
      }
     })
     .then( err => console.log(err));
  };
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rEmail: "",
      rPassword: "",
    },
    validationSchema: Yup.object().shape({
      email: login
        ? Yup.string().email("Enter Valid E-mail Id").required("Required")
        : Yup.string(),
      password: login
        ? Yup.string().min(4, "Minimum 4 Characters").required("Required")
        : Yup.string(),
      rEmail: !login
        ? Yup.string().email("Enter Valid E-mail Id").required("Required")
        : Yup.string(),
      rPassword: !login
        ? Yup.string().min(4, "Minimum 4 Characters").required("Required")
        : Yup.string(),
    }),
    onSubmit: (values) => {
      login ? adminSubmit(values) : employeeSubmit(values);
    },
  });
  return (
    <div>
      <LoginNav />
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
              key={login ? "admin" : "employee"}
              initial={{ opacity: 0, x: login ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: login ? -50 : 50 }}
              transition={{ duration: 0.2 }}
              className="row"
            >
              {login ? (
                <div className="col col-12 form-section">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column">
                      <Typography align="center" sx={{ my: 2 }}>
                        ADMIN LOGIN
                      </Typography>
                      <FormControl
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        sx={{ my: 4 }}
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
                        {formik.touched.email &&
                          Boolean(formik.errors.email) && (
                            <FormHelperText>
                              {formik.errors.email}
                            </FormHelperText>
                          )}
                      </FormControl>
                      <FormControl
                        error={
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                        sx={{ my: 4 }}
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
                      <Typography variant="overline" sx={{ mx: 1, fontWeight: 'bolder'}}>
                        <Link to='/admin-register' className="text-decoration-none" >Register ?</Link>
                      </Typography>
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
                          Login
                        </Button>
                      </FormControl>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="col col-12 form-section">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="d-flex flex-column">
                      <Typography sx={{ my: 2 }} align="center">
                        EMPLOYEE LOGIN
                      </Typography>
                      <FormControl
                        error={
                          formik.touched.rEmail && Boolean(formik.errors.rEmail)
                        }
                        sx={{ my: 4 }}
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
                          name="rEmail"
                          onChange={formik.handleChange}
                          value={formik.values.rEmail}
                          onBlur={formik.handleBlur}
                        />
                        {formik.touched.rEmail &&
                          Boolean(formik.errors.rEmail) && (
                            <FormHelperText>
                              {formik.errors.rEmail}
                            </FormHelperText>
                          )}
                      </FormControl>
                      <FormControl
                        error={
                          formik.touched.rPassword &&
                          Boolean(formik.errors.rPassword)
                        }
                        sx={{ my: 4 }}
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
                          name="rPassword"
                          onChange={formik.handleChange}
                          value={formik.values.rPassword}
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
                        {formik.touched.rPassword &&
                          Boolean(formik.errors.rPassword) && (
                            <FormHelperText>
                              {formik.errors.rPassword}
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
                          // disabled={formik.isSubmitting }
                        >
                          Login
                        </Button>
                      </FormControl>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

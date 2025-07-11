import { useState, useEffect } from "react";
import Login from "../Components/Login";
import LoginNav from "../Components/LoginNav";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { use } from "react";

const HomePage = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true
  useEffect(() => {
    axios.get('http://localhost:3000')
     .then(res => {
      if(res.data.Status === "Success"){
        navigate('/admin-dashboard')
      } else {
        console.log(res.data.Error)
      }
     })
     .catch(err => console.log(err))
  })

  return (
    <div className="login-page">
      <Login />
    </div>
  );
};

export default HomePage;

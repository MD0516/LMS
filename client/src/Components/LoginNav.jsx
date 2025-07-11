import React, { useState} from 'react'
import { Button } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { loginValue, loginFalse } from '../Redux/LoginSlice/LoginSlice'
import { motion } from 'framer-motion'

const LoginNav = () => {
  const login = useSelector((state) => state.login)
    const dispatch = useDispatch(login);
  return (
    <div className='w-100 d-flex justify-content-center ' >
        <motion.div initial={{ scale: 0, opacity: 0}} animate={{ scale: 1, opacity: 1}} exit={{ scale: 0, opacity: 0}} transition={{ duration: 0.5}} className="row login-nav my-3 ">
                <Button sx={{ color: '#fff', borderRadius: 0}} className="col text-center admin-tab" onClick={() => dispatch(loginValue(true))}>
                    <motion.span initial={{ x: -50, opacity: 0}} animate={{ x: 0, opacity: 1}} exit={{ x: -50, opacity: 0}} transition={{ duration: .7, ease:'linear'}} whileTap={{ scale: 0.8, duration: .1}}>Admin Login</motion.span>
                </Button>
                <Button sx={{ color: '#fff'}} className="col text-center employee-tab" onClick={() => dispatch(loginFalse(false))}>
                    <motion.span initial={{ x: 50, opacity: 0}} animate={{ x: 0, opacity: 1}} exit={{ x: 50, opacity: 0}} transition={{ duration: .7, ease:'linear'}} whileTap={{ scale: 0.8, duration: .1}}>Employee Login</motion.span>
                </Button>
        </motion.div>
    </div>
  )
}

export default LoginNav
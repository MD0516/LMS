import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Avatar, MenuItem } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import axios from "axios";

const EmployeeNav = () => {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios
      .get("http://localhost:3000/emp-logout")
      .then((res) => {
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  const linkPaths = [
    { path: "/employee-dashboard", label: "Dashboard" },
    { path: "/employee-dashboard/change-password", label: "Change Password" },
    { path: "/employee-dashboard/leave-request", label: "Leaves" },
  ];

  const navVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  };

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const [name, setName ] = useState('')
  const fetchEmployeeName = () => {
    axios.get("http://localhost:3000/emp-name", {withCredentials: true})
     .then(res => {
      const formattedName = `${res.data[0].fName} ${res.data[0].lName}`;
      setName(formattedName)
     })
     .catch(err => console.log('Error fetching name', err))
  }

  useEffect(() => {
    fetchEmployeeName();
  },[open ])

  return (
    <div className="w-100 d-flex justify-content-center ">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, ease: "linear" }}
        className="row admin-nav my-3 "
      >
        {linkPaths.map((link, l) => {
          return (
            <Button
              key={l}
              sx={{ color: "#fff", borderRadius: 0 }}
              className="col text-center admin-tab"
              onClick={() => navigate(link.path)}
            >
              <motion.span
                variants={navVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.7, ease: "linear" }}
                whileTap={{ scale: 0.8, duration: 0.1 }}
              >
                {link.label}
              </motion.span>
            </Button>
          );
        })}
        <Stack
          direction="row"
          className="col d-flex align-items-center justify-content-center"
          spacing={2}
        >
          <div>
            <Button
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
              sx={{ color: "#fff", borderRadius: 0 }}
            >
              <motion.div whileTap={{ scale: 0.8 }}>
                <Avatar src="/broken-image.jpg" />
              </motion.div>
            </Button>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "left top" : "left bottom",
                  }}
                >
                  <Paper
                    sx={{ backgroundColor: "#111", color: "#fff", width: 'fit-content' }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        onKeyDown={handleListKeyDown}
                      >
                        <MenuItem onClick={handleClose}>{name}</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </div>
        </Stack>
      </motion.div>
    </div>
  );
};

export default EmployeeNav;

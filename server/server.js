import express, { response } from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import cookieParser from "cookie-parser";
import { config } from "dotenv";

config();

const PORT = process.env.PORT
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const salt = 10;
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());

const db = mysql.createConnection({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
});

//Verifying Admin 

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.AdminToken;
  if (!token) {
    return res.json({ Error: "Not Authenticated" });
  } else {
    jwt.verify(token, "privateKey", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Invalid Token" });
      } else {
        next();
      }
    });
  }
};

app.get("/", verifyAdmin, (req, res) => {
  return res.json({ Status: "Success" });
});

app.get('/admin-name', (req,res) => {
  const sql = "SELECT name FROM admin_details WHERE id = ?";
  const token = req.cookies.AdminToken;
  if(!token) return res.json({ Error: 'Unauthorized', res});

  jwt.verify(token, 'privateKey', (err,decoded) => {
    if (err) return res.json({Error: 'Invalid Token', err});
    const id = decoded.id;

    db.query(sql, [id], (err, result) => {
      if(err) return res.json({ Error: 'Fetching Admin name', err});
      return res.json(result)
    })
  })
})

//Verifying Employee

const verifyEmployee = (req, res, next) => {
  const token = req.cookies.EmployeeToken;
  if (!token) return res.json({ Error: "Unauthorized" });

  jwt.verify(token, "privateKey", (err, decoded) => {
    if (err) return res.json({ Error: "Invalid Token" });
    req.empData = decoded;
    next();
  });
};

app.get("/employee-info", verifyEmployee, (req, res) => {
  const empId = req.empData.empId;
  const sql =
    "SELECT empId, fName, lName, email, gender, birthDate, department, country, city, address, number FROM emp_details WHERE empId = ?";
  db.query(sql, [empId], (err, result) => {
    if (err) return res.json({ Error: "Error fetching Employee Details", err });
    return res.json(result[0]);
  });
});

app.get("/emp-name", (req, res) => {
  const sql = "SELECT fName, lName FROM emp_details WHERE empId = ?";
  const token = req.cookies.EmployeeToken;
  if(!token) return res.json({ Error: 'Unauthorized', res});

  jwt.verify(token, "privateKey", (err, decoded) => {
    if(err) return res.json({Error: 'Invalid Token', err});
    const empId = decoded.empId;

    db.query(sql, [empId], (err, result) => {
      if(err) return res.json({ Error: 'Fetching employee name', err});
      return res.json(result)
    })
  })
})

//Admin & Employee Register, Login, Logout, Change Password

app.post("/admin-register", (req, res) => {
  const sql = " INSERT INTO admin_details(`name`,`email`,`password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err)
      return res.json({ Error: "Error occurred while hashing the password" });
    const values = [req.body.name, req.body.email, hash];
    db.query(sql, [values], (err, result) => {
      if (err){
        if(err.code === 'ER_DUP_ENTRY'){
          res.status(409).json({Error: 'Email Exists'})
        }
        return res.status(500).json({
          Error: "Error occurred while inserting data to server",
          err,
        });}
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/admin-login", (req, res) => {
  const sql = "SELECT * FROM admin_details WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Admin Login error in Server" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err)
            return res.json({ Error: "Admin Login Password Hashing error" });
          if (response) {
            const name = data[0].name;
            const email = data[0].email;
            const id = data[0].id;
            const adminToken = jwt.sign({ name, email, id }, "privateKey", {
              expiresIn: "7d",
            });
            res.cookie("AdminToken", adminToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            });
            return res.json({ Status: "Success" });
          } else {
            return res.json({ Error: "Invalid Credentials" });
          }
        }
      );
    } else {
      return res.json({ Error: "No Email Existed" });
    }
  });
});

app.post("/employee-register", (req, res) => {
  const sql =
    "INSERT INTO emp_details(`empId`,`fName`,`lName`,`email`,`password`,`gender`,`birthDate`,`department`,`country`,`city`,`address`,`number`) VALUES (?)";
  const rawPassword = req.body.cPassword;
  if (!rawPassword) {
    return res.status(400).json({ Error: "Password is required" });
  }

  bcrypt.hash(rawPassword.toString(), salt, (err, hash) => {
    if (err)
      return res.json({ Error: "Error occurred while hashing the password" });

    const values = [
      req.body.empId,
      req.body.fName,
      req.body.lName,
      req.body.email,
      hash,
      req.body.gender,
      req.body.birthDate,
      req.body.department,
      req.body.country,
      req.body.city,
      req.body.address,
      req.body.number,
    ];

    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err); // log the actual error
        return res.status(500).json({
          Error: "Error occurred while inserting data to server",
          err,
        });
      }
      return res.json({ Status: "Success" });
    });
  });
});

app.post("/employee-login", (req, res) => {
  const sql = "SELECT * FROM emp_details WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.json({ Error: "Employee Login error in Server" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err)
            return res.json({ Error: "Employee Login Password Hashing error" });
          if (response) {
            const email = data[0].email;
            const empId = data[0].empId;
            const name = data[0].fName + " " + data[0].lName;
            const gender = data[0].gender;
            const number = data[0].number;
            const adminToken = jwt.sign(
              { email, empId, name, gender, number },
              "privateKey",
              {
                expiresIn: "7d",
              }
            );
            res.cookie("EmployeeToken", adminToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            });
            return res.json({ Status: "Success" });
          } else {
            return res.json({ Error: "Invalid Credentials" });
          }
        }
      );
    } else {
      return res.json({ Error: "No Email Existed" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("AdminToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return res.json({ Status: "Logout Success" });
});

app.get("/emp-logout", (req, res) => {
  res.clearCookie("EmployeeToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  return res.json({ Status: "Logout Success" });
});

app.post("/change-admin-password", (req, res) => {
  const token = req.cookies.AdminToken;
  if (!token) return res.json({ Error: "Unauthorized" });

  jwt.verify(token, "privateKey", (err, decoded) => {
    if (err) return res.json({ Error: "Invalid Token", err });

    const email = decoded.email;

    db.query(
      "SELECT password FROM admin_details WHERE email = ?",
      [email],
      (err, result) => {
        if (err || result.length === 0) {
          return res.json({ Error: "Admin not found" });
        }
        const currentHashedPassword = result[0].password;

        bcrypt.compare(
          req.body.cPassword,
          currentHashedPassword,
          (err, response) => {
            if (!response) {
              return res
                .status(401)
                .json({ Error: "Old Password is Incorrect" });
            } else {
              bcrypt.hash(req.body.rPassword, salt, (err, hash) => {
                if (err)
                  return res.json({
                    Error: "Occurred while hashing new password",
                  });

                db.query(
                  "UPDATE admin_details SET password = ? WHERE email = ? ",
                  [hash, email],
                  (err, result) => {
                    if (err)
                      return res.json({
                        Error: "Occurred while Updating Password;",
                      });
                    return res.json({
                      Success: "Password Changed Successfully",
                    });
                  }
                );
              });
            }
          }
        );
      }
    );
  });
});
app.post("/change-employee-password", (req, res) => {
  const token = req.cookies.EmployeeToken;
  if (!token) return res.json({ Error: "Unauthorized" });

  jwt.verify(token, "privateKey", (err, decoded) => {
    if (err) return res.json({ Error: "Invalid Token", err });

    const email = decoded.email;

    db.query(
      "SELECT password FROM emp_details WHERE email = ?",
      [email],
      (err, result) => {
        if (err || result.length === 0) {
          return res.json({ Error: "Employee not found" });
        }
        const currentHashedPassword = result[0].password;

        bcrypt.compare(
          req.body.cPassword,
          currentHashedPassword,
          (err, response) => {
            if (!response) {
              return res
                .status(401)
                .json({ Error: "Old Password is Incorrect" });
            } else {
              bcrypt.hash(req.body.rPassword, salt, (err, hash) => {
                if (err)
                  return res.json({
                    Error: "Occurred while hashing new password",
                  });

                db.query(
                  "UPDATE emp_details SET password = ? WHERE email = ? ",
                  [hash, email],
                  (err, result) => {
                    if (err)
                      return res.json({
                        Error: "Occurred while Updating Password;",
                      });
                    return res.json({
                      Success: "Password Changed Successfully",
                    });
                  }
                );
              });
            }
          }
        );
      }
    );
  });
});

//Add, Update, Delete, Fetch Department

app.post("/add-dept", (req, res) => {
  const sql =
    "INSERT INTO department (`departmentCode`,`departmentName`,`departmentShortName`) VALUES (?,?,?)";
  const values = [req.body.dCode, req.body.dName, req.body.dShortName];
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(400).json({
        Status: "error",
        message: err.sqlMessage,
      });
    }
    return res.json({ Status: "Success" });
  });
});

app.post("/update-dept", (req, res) => {
  const sql =
    "UPDATE department SET departmentCode = ?, departmentName = ?, departmentShortName = ? WHERE departmentCode = ?";
  const values = [
    req.body.uCode,
    req.body.uName,
    req.body.uShortName,
    req.body.dCode,
  ];
  db.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: "Occurred while Updating Details" });
    return res.json(result[0]);
  });
});

app.get("/fetch-dept", (req, res) => {
  const sql = `
    SELECT 
      departmentCode, 
      departmentName, 
      departmentShortName, 
      DATE_FORMAT(creationDate, '%d-%m-%Y') AS creationDate 
    FROM department
  `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error fetching Employee Details", err });
    return res.json(result);
  });
});

app.post("/delete-dept", (req, res) => {
  const sql = "DELETE FROM department WHERE departmentCode = ?";
  const dCode = req.body.dCode;
  db.query(sql, dCode, (err, result) => {
    if (err) return console.log("Error while Deleting Department", err);
    return res.json({ Status: "Department Delete success" });
  });
});

app.get("/fetch-total-dept", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM department";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error fetching total Department", err });
    return res.json(result[0].total);
  });
});

//Add, Update, Delete, Fetch Leave type

app.post("/add-leave-type", (req, res) => {
  const sql = "INSERT INTO leave_type (`leaveType`,`description`) VALUES (?,?)";
  const values = [req.body.type, req.body.description];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.log("sql error", err);
      return res.status(400).json({
        Status: "error",
        message: err.sqlMessage,
      });
    }
    return res.json({ Status: "Success" });
  });
});

app.post("/update-leave-type", (req, res) => {
  const sql =
    "UPDATE leave_type SET leaveType = ?, description = ? WHERE leaveType = ?";
  const values = [req.body.uType, req.body.uDescription, req.body.type];
  db.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: "Occurred while Updating Details" });
    return res.json(result[0]);
  });
});

app.get("/fetch-leave-type", (req, res) => {
  const sql = `
    SELECT 
      leaveType, 
      description, 
      DATE_FORMAT(createdAt, '%d-%m-%Y') AS creationDate 
    FROM leave_type
  `;
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error fetching Employee Details", err });
    return res.json(result);
  });
});

app.post("/delete-leave-type", (req, res) => {
  const sql = "DELETE FROM leave_type WHERE leaveType = ?";
  const lType = req.body.type;
  db.query(sql, lType, (err, result) => {
    if (err) return console.log("Error while Deleting Leave Type", err);
    return res.json({ Status: "Leave Type Delete success" });
  });
});

app.get("/fetch-total-leave-type", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM leave_type";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error fetching total Leave Type", err });
    return res.json(result[0].total);
  });
});

// Employee Update, Fetch, Total Employees

app.get("/fetch-employees", (req, res) => {
  const sql = `
    SELECT 
      empId, 
      fName, 
      lName, 
      department, 
      status,
      DATE_FORMAT(created_at, '%d-%m-%Y') AS creationDate 
    FROM emp_details
  `;
  db.query(sql, (err, result) => {
    if (err) return res.json(console.log("Error Fetching Employee Data", err));
    return res.json(result);
  });
});

app.post("/status-update-employee", (req, res) => {
  const sql = "UPDATE emp_details SET status = ? WHERE empId = ?";
  const values = [req.body.status, req.body.empId];
  db.query(sql, values, (err, result) => {
    if (err) return console.log("Error while Updating status Employee", err);
    return res.json({ Status: "Employee Delete success" });
  });
});

app.post("/delete-employee", (req, res) => {
  const sql = "DELETE FROM emp_details WHERE empId = ?";
  const id = req.body.empId;
  db.query(sql, id, (err, result) => {
    if (err) return console.log("Error while Deleting Employee", err);
    return res.json({ Status: "Employee Delete success" });
  });
});

app.get("/fetch-total-employees", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM emp_details";
  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error fetching total Employees", err });
    return res.json(result[0].total);
  });
});

app.post("/update-emp-info", (req, res) => {
  const sql = `
  UPDATE emp_details SET 
    fName = ?, lName = ?, email = ?, gender = ?, birthDate = ?,
    department = ?, country = ?, city = ?, address = ?, number = ?
  WHERE empId = ?
`;

  const values = [
    req.body.fName,
    req.body.lName,
    req.body.email,
    req.body.gender,
    req.body.birthDate,
    req.body.department,
    req.body.country,
    req.body.city,
    req.body.address,
    req.body.number,
    req.body.empId, // <-- condition
  ];

  db.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: "Update Failed", err });
    return res.json({ Status: "Success" });
  });
});

// Leave Type Add, Fetch

app.post("/apply-leave", (req, res) => {
  const sql =
    "INSERT INTO leave_applications(`empId`,`leaveType`,`from`,`to`,`description`, `name`) VALUES (?)";
  const token = req.cookies.EmployeeToken;
  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 10); // 'YYYY-MM-DD'
  };
  if (!token) return res.json({ Error: "Unauthorized" });

  jwt.verify(token, "privateKey", (err, decoded) => {
    if (err) return res.json({ Error: "Invalid Token", err });
    const empId = decoded.empId;
    const name = decoded.name;

    const values = [
      empId,
      req.body.type,
      formatDate(req.body.from),
      formatDate(req.body.to),
      req.body.description,
      name,
    ];

    db.query(sql, [values], (err, result) => {
      if (err) return res.json({ Error: "Occurred while uploading data", err });
      return res.json({ Status: "Success" });
    });
  });
});

app.get("/fetch-leave", (req, res) => {
  const sql =
    "SELECT `empId`, `leaveType`, DATE_FORMAT(`from`, '%d-%m-%y') AS `from`, DATE_FORMAT(`to`, '%d-%m-%y') AS `to`, `description`, DATE_FORMAT(`postingDate`, '%d-%m-%Y') AS `postingDate`, `adminRemark`, `status` FROM leave_applications WHERE empId = ?";
  const token = req.cookies.EmployeeToken;
  if (!token) return res.json({ Error: "Unauthorized" });

  jwt.verify(token, "privateKey", (err, decoded) => {
    if (err) return res.json({ Error: "Invalid Token", err });
    const empId = decoded.empId;

    db.query(sql, [empId], (err, result) => {
      if (err)
        return res.json({
          Error: "Occurred while fetching Leave data form DB",
          err,
        });
      return res.json({ LeaveData: result });
    });
  });
});

app.get("/fetch-leave-type", (req, res) => {
  const sql = "SELECT leaveType FROM leave_type";

  db.query(sql, (err, result) => {
    if (err) return res.json({ Error: "while fetching Leave Types", err });
    return res.json(result);
  });
});

// Fetch Leave History

app.get("/fetch-leave-history", (req, res) => {
  const sql =
    "SELECT `id`, `empId`, `leaveType`, DATE_FORMAT(`from`, '%d-%m-%y') AS `from`, DATE_FORMAT(`to`, '%d-%m-%y') AS `to`, `description`, DATE_FORMAT(`postingDate`, '%d-%m-%Y') AS `postingDate`, `adminRemark`, `status`, `name` FROM leave_applications";

  db.query(sql, (err, result) => {
    if (err)
      return res.json({
        Error: "Occurred while fetching Leave data form DB",
        err,
      });
    return res.json({ LeaveData: result });
  });
});

app.get("/fetch-pending-leave-history", (req, res) => {
  const sql =
    "SELECT `id`,`empId`, `leaveType`, DATE_FORMAT(`from`, '%d-%m-%y') AS `from`, DATE_FORMAT(`to`, '%d-%m-%y') AS `to`, `description`, DATE_FORMAT(`postingDate`, '%d-%m-%Y') AS `postingDate`, `adminRemark`, `status`, `name` FROM leave_applications WHERE `status` = 'Pending' ";

  db.query(sql, (err, result) => {
    if (err)
      return res.json({
        Error: "Occurred while fetching Leave data form DB",
        err,
      });
    return res.json({ LeaveData: result });
  });
});

app.get("/fetch-approved-leave-history", (req, res) => {
  const sql =
    "SELECT `id`, `empId`, `leaveType`, DATE_FORMAT(`from`, '%d-%m-%y') AS `from`, DATE_FORMAT(`to`, '%d-%m-%y') AS `to`, `description`, DATE_FORMAT(`postingDate`, '%d-%m-%Y') AS `postingDate`, `adminRemark`, `status`, `name` FROM leave_applications WHERE `status` = 'Approved' ";

  db.query(sql, (err, result) => {
    if (err)
      return res.json({
        Error: "Occurred while fetching Leave data form DB",
        err,
      });
    return res.json({ LeaveData: result });
  });
});

app.get("/fetch-rejected-leave-history", (req, res) => {
  const sql =
    "SELECT `id`, `empId`, `leaveType`, DATE_FORMAT(`from`, '%d-%m-%y') AS `from`, DATE_FORMAT(`to`, '%d-%m-%y') AS `to`, `description`, DATE_FORMAT(`postingDate`, '%d-%m-%Y') AS `postingDate`, `adminRemark`, `status`, `name` FROM leave_applications WHERE `status` = 'Rejected' ";

  db.query(sql, (err, result) => {
    if (err)
      return res.json({
        Error: "Occurred while fetching Leave data form DB",
        err,
      });
    return res.json({ LeaveData: result });
  });
});

app.get("/fetch-cancelled-leave-history", (req, res) => {
  const sql =
    "SELECT `id`, `empId`, `leaveType`, DATE_FORMAT(`from`, '%d-%m-%y') AS `from`, DATE_FORMAT(`to`, '%d-%m-%y') AS `to`, `description`, DATE_FORMAT(`postingDate`, '%d-%m-%Y') AS `postingDate`, `adminRemark`, `status`, `name` FROM leave_applications WHERE `status` = 'Cancelled' ";

  db.query(sql, (err, result) => {
    if (err)
      return res.json({
        Error: "Occurred while fetching Leave data form DB",
        err,
      });
    return res.json({ LeaveData: result });
  });
});

// Fetch Employee and their Leave Application Details

app.get("/fetch-employee-details", (req, res) => {
  const sql =
    "SELECT `empId`, `leaveType`, DATE_FORMAT(`from`, '%d-%m-%y') AS `from`, DATE_FORMAT(`to`, '%d-%m-%y') AS `to`, `description`, DATE_FORMAT(`postingDate`, '%d-%m-%Y') AS `postingDate`, `adminRemark`, `status`, `name` FROM leave_applications WHERE id = ?";
  const sql2 = "SELECT `email`,`gender`, `number` FROM emp_details WHERE empId = ? ";
  const id = req.query.id;

  if (!id) return res.json({ Error: "Occurred fetching Employee!" });

  db.query(sql, [id], (err1, leaveResults) => {
    if (err1) return res.json({ Error: "Query 1", err1 });
    if (leaveResults.length === 0)
      return res.json({ Error: "No Leave Records found" });

    const empId = leaveResults[0].empId;
    db.query(sql2, [empId], (err2, empResults) => {
      if (err2) return res.json({ Error: "Query 2", err2 });
      return res.json({leaveResults, empResults});
    });
  });
});

//Post status & Admin Action

app.post('/status-update', (req, res) =>{
  const sql = 'UPDATE leave_applications SET adminRemark = ?, status = ? WHERE id = ?'
  const values = [
    req.body.adminRemark,
    req.body.status,
    req.body.id
  ]

  db.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update Failed'});
    return res.json({ Status: "Success"})
  })
})

app.listen(PORT, () => {
  console.log("Server Running on Port 3000...");
});

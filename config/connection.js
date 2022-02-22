/*const mysql = require("mysql2");

connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "@mysql123",
  database: "employee_tracker",
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(`Connected to db. ThreadID: ${connection.threadId}`);
});

module.exports = connection; */


// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "@mysql123",
    database: "employee_tracker",
  },
  console.log("Connected to the employee_tracker database.")
);

module.exports = connection;
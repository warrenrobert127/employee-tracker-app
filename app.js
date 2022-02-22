const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const connection = require("./config/connection");
const startingChoices = [
  "View all Departments",
  "View all Roles",
  "View all Employees",
  "Add a Department",
  "Add a Role",
  "Add an Employee",
  "Update an Employee Role",
];
const queryAllEmployee = `SELECT e.id AS 'ID', e.first_name AS 'First Name', e.last_name AS 'Last Name', roles.title AS 'Job Title', departments.department_name AS 'Department', roles.salary AS 'Salary',  CONCAT(m.first_name,' ',m.last_name) AS Manager 
    FROM employees e 
    LEFT JOIN employees m ON m.id = e.manager_id 
    JOIN roles ON e.role_id = roles.id 
    JOIN departments ON departments.id = roles.department_id;`;

const startApp = () => {
  inquirer
    .prompt({
      name: "menuChoice",
      type: "list",
      message: "Select an option",
      choices: startingChoices,
    })
    .then((answer) => {
      switch (answer.menuChoice) {
        case "View all Departments":
          viewDepartments();
          break;
        case "View all Roles":
          viewRoles();
          break;
        case "View all Employees":
          viewEmployees();
          break;
        case "Add a Department":
          addDepartment();
          break;
        case "Add a Role":
          addRole();
          break;
        case "Add an Employee":
          addEmployee();
          break;
        case "Update an Employee Role":
          updateRole();
          break;
      }
    });
};

const viewDepartments = () => {
  query = `SELECT department_name AS "Departments" FROM departments`;
  connection.query(query, (err, results) => {
    if (err) throw err;

    console.log("");
    console.table("All Departments", results);
    startApp();
  });
};

const viewRoles = () => {
  query = `SELECT roles.title AS Title, roles.salary AS Salary, department_name AS Department
    FROM
        roles
    JOIN
    departments ON roles.department_id = departments.id;`;
  connection.query(query, (err, results) => {
    if (err) throw err;

    console.log("");
    console.table("All Employees", results);
    startApp();
  });
};

const viewEmployees = () => {
  query = queryAllEmployee;
  connection.query(query, (err, results) => {
    if (err) throw err;

    console.log("");
    console.table("All Employees", results);
    startApp();
  });
};

const addDepartment = () => {
  query = `SELECT department_name AS "Departments" FROM departments`;
  connection.query(query, (err, results) => {
    if (err) throw err;

    console.log("");
    console.table("List of current Departments"), results;

    inquirer
      .prompt([
        {
          name: "newDept",
          type: "input",
          message: "Enter the name of the Department to add:",
        },
      ])
      .then((answer) => {
        connection.query(
          `INSERT INTO departments(department_name) VALUES( ? )`,
          answer.newDept
        );
        startApp();
      });
  });
};

const addRole = () => {
  const addRoleQuery = `SELECT * FROM roles; SELECT * FROM departments`;
  connection.query(addRoleQuery, (err, results) => {
    if (err) throw err;

    console.log("");
    console.table("List of current Roles:"), results[0];

    inquirer
      .prompt([
        {
          name: "newTitle",
          type: "input",
          message: "Enter the new Title:",
        },
        {
          name: "newSalary",
          type: "input",
          message: "Enter the salary for the new Title:",
        },
        {
          name: "dept",
          type: "list",
          choices: function () {
            let choiceArray = results[1].map(
              (choice) => choice.department_name
            );
            return choiceArray;
          },
          message: "Select the Department for this new Title:",
        },
      ])
      .then((answer) => {
        connection.query(
          `INSERT INTO roles(title, salary, department_id) 
                VALUES
                ("${answer.newTitle}", "${answer.newSalary}", 
                (SELECT id FROM departments WHERE department_name = "${answer.dept}"));`
        );
        startApp();
      });
  });
};

startApp();

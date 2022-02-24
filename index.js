const inquirer = require("inquirer");
const db = require("./config/connection");
const consoleTable = require("console.table");
const mysql = require("mysql2");

const promptUser = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: "Welcome to Employee Tracker! What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.menu) {
        case "View all departments":
          allDept();
          break;
        case "View all roles":
          allRoles();
          break;
        case "View all employees":
          allEmp();
          break;
        case "Add a department":
          addDept();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmp();
          break;
        case "Update an employee role":
          updateEmpRole();
          break;
      }
    });
};

// view all departments
const allDept = () => {
  const sql = `SELECT dept_name AS "Departments" FROM department;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table("All Departments", results);
  });
  setTimeout(promptUser, 1000);
};

// view all roles
const allRoles = () => {
  const sql = `SELECT 
                    role.id AS ID, role.title AS Title, role.salary AS Salary, dept_name AS Department
                FROM
                    role
                        JOIN
                    department ON role.department_id = department.id;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table("All Roles", results);
  });
  setTimeout(promptUser, 1000);
};

// view all employees
const allEmp = () => {
  const sql = `SELECT 
                    e.id AS 'ID',
                    e.first_name AS 'First Name',
                    e.last_name AS 'Last Name',
                    role.title AS 'Job Title',
                    department.dept_name AS 'Department',
                    role.salary AS 'Salary',
                    CONCAT(m.first_name, ' ', m.last_name) AS Manager
                FROM
                    employee e
                        LEFT JOIN
                    employee m ON m.id = e.manager_id
                        JOIN
                    role ON e.role_id = role.id
                        JOIN
                    department ON department.id = role.department_id;`;

  db.query(sql, (err, results) => {
    if (err) throw err;
    console.table("All Roles", results);
  });
  setTimeout(promptUser, 1000);
};

// add a department
const addDept = () => {
  const addDeptQuestions = [
    {
      type: "input",
      name: "dept_name",
      message: "Please enter a department name",
      validate: (deptInput) => {
        if (deptInput) {
          return true;
        } else {
          console.log("Please enter a department name!");
          return false;
        }
      },
    },
  ];

  inquirer.prompt(addDeptQuestions).then((answers) => {
    console.log(answers.dept_name);
    const deptName = answers.dept_name;
    const sql = `INSERT INTO department (dept_name) VALUES ('${deptName}');`;
    console.log(sql);
    db.query(sql, (err, results) => {
      if (err) throw err;
      console.log("Department Added!");
    });
    setTimeout(promptUser, 1000);
  });
};

// add a role
const addRole = () => {
  const addRoleQuery = `SELECT * FROM role; SELECT * FROM department`;
  db.query(addRoleQuery, (err, results) => {
    if (err) throw err;

    console.log("");
    console.table("List of current Roles:"), results[0];

    inquirer
      .prompt([
        {
          name: "newTitle",
          type: "input",
          message: "Please enter the new role title:",
        },
        {
          name: "newSalary",
          type: "input",
          message: "Please enter the salary for the new Title:",
        },
        {
          name: "dept",
          type: "list",
          choices: function () {
            let choiceArray = results[1].map((choice) => choice.dept_name);
            return choiceArray;
          },
          message: "Select the Department that will contain this role:",
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO role(title, salary, department_id) 
                VALUES
                ("${answer.newTitle}", "${answer.newSalary}", 
                (SELECT id FROM department WHERE dept_name = "${answer.dept}"));`
        );
        setTimeout(promptUser, 1000);
      });
  });
};

// add an employee
const addEmp = () => {
  const roleQuery = `SELECT * from role; SELECT CONCAT (e.first_name," ",e.last_name) AS full_name FROM employee e`;
  const addEmployeeQuestions = [
    "What is their first name?",
    "What is their last name?",
    "What role should be assigned?",
    "What manager should be assigned?",
  ];

  db.query(roleQuery, (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: addEmployeeQuestions[0],
        },
        {
          name: "lastName",
          type: "input",
          message: addEmployeeQuestions[1],
        },
        {
          name: "role",
          type: "list",
          choices: function () {
            let choiceArray = results[0].map((choice) => choice.title);
            return choiceArray;
          },
          message: addEmployeeQuestions[2],
        },
        {
          name: "manager",
          type: "list",
          choices: function () {
            let choiceArray = results[1].map((choice) => choice.full_name);
            return choiceArray;
          },
          message: addEmployeeQuestions[3],
        },
      ])
      .then((answer) => {
        db.query(
          `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, 
                (SELECT id FROM role WHERE title = ? ), 
                (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ? ) AS tmptable))`,
          [answer.firstName, answer.lastName, answer.role, answer.manager]
        );
        setTimeout(promptUser, 1000);
      });
  });
};

// update an employee role
const updateEmpRole = () => {
  const query = `SELECT CONCAT (first_name," ",last_name) AS full_name FROM employee; SELECT title FROM role`;
  db.query(query, (err, results) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "empl",
          type: "list",
          choices: function () {
            let choiceArray = results[0].map((choice) => choice.full_name);
            return choiceArray;
          },
          message: "Select an employee to update their role:",
        },
        {
          name: "newRole",
          type: "list",
          choices: function () {
            let choiceArray = results[1].map((choice) => choice.title);
            return choiceArray;
          },
        },
      ])
      .then((answer) => {
        db.query(
          `UPDATE employee 
            SET role_id = (SELECT id FROM role WHERE title = ? ) 
            WHERE id = (SELECT id FROM(SELECT id FROM employee WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`,
          [answer.newRole, answer.empl],
          (err, results) => {
            if (err) throw err;
            setTimeout(promptUser, 1000);
          }
        );
      });
  });
};

module.exports = promptUser;

promptUser();

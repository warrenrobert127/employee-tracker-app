INSERT INTO departments(department_name)
VALUES ('Management'),
('Sales'),
('Warehouse'),
('Human Resources'),
('Quality Control');

INSERT INTO roles(title, salary, department_id)
VALUES('Regional Manager', 90000, 1),
('Sales Rep', 10000, 2),
('HR Rep', 50000, 4);

INSERT INTO employees(first_name, last_name)
VALUES('Kyle', 'Schwarber'),
('Calvin', 'Brodous'),
('Curtis', 'Jackson');
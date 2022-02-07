INSERT INTO department (dept_name)
VALUES
('Engineering'),
('Executive'),
('Human Resources'),
('Legal'),
('Design');

INSERT INTO role (title, salary, department_id)
VALUES
('Senior Engineer', 150000, 1),
('Junior Engineer', 100000, 1),
('CEO', 400000, 2),
('CFO', 350000, 2),
('CTO', 400000, 2),
('Human Resources Officer', 90000, 3),
('Lawyer', 200000, 4),
('Legal Intern', 30000, 4),
('UX Designer', 130000, 5),
('Product Designer', 120000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Neha', 'Bardhan', 10, 9),
('Timothy', 'Nguyen', 6, 9),
('Manish', 'Koleti', 1, 8),
('Afra', 'Ismail', 7, 9),
('Soummitra', 'Anand', 8, 9),
('Megha', 'Samala', 2, 8),
('Bob', 'Workerman', 4, 9),
('Joe', 'Employeeguy', 5, 9),
('Jessica', 'Girlboss', 3, NULL),
('Melissa', 'Workperson', 9, 9),
('James', 'Workdad', 1, 8),
('Logan', 'Laborman', 6, 9),
('Vanessa', 'Employeegal', 9, 9);

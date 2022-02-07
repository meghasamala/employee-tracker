const db = require('./db/connection.js');
// const cTable = require('console.table')

class Database {
    constructor(db) {
        this.db = db
    }

    async getDepartments() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM department`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                resolve(rows);
            });

        });
    };

    async getDepartmentNames() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT department.dept_name FROM department`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                const deptNames = rows.map(obj => obj.dept_name);
                resolve(deptNames);
            });

        });
    };

    async getDepartmentIds(dept_name) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id FROM department where department.dept_name = ?`;
            const params = dept_name;
            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                const departmentIds = rows.map(obj => obj.id)[0];
                resolve(departmentIds);
            });

        });
    };

    async getRoles() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT role.title, role.salary, department.dept_name
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                resolve(rows);
            });

        });
    };

    async getRoleIds(role) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id FROM role WHERE role.title = ?`
            const params = role
            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                const roleId = rows.map(obj => obj.id)[0];
                resolve(roleId);
            });

        });
    };

    async getRoleTitles() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT role.title
            FROM role`;
            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                const roleTitles = rows.map(obj => obj.title);
                resolve(roleTitles);
            });

        });
    };

    async getEmployees() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT e.id, e.first_name, e.last_name,
            COALESCE(role.title, 'N/A') AS title,
            COALESCE(department.dept_name, 'N/A') AS dept_name,
            COALESCE(role.salary, 'N/A') AS salary, 
            CONCAT_WS(' ', m.first_name, m.last_name) AS manager
            FROM employee e
            LEFT JOIN role on e.role_id = role.id
            LEFT JOIN department on role.department_id = department.id
            LEFT JOIN employee m ON e.manager_id = m.id;`

            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                resolve(rows);
            });

        });
    };

    async getEmployeeNames() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT CONCAT_WS(' ', employee.first_name, employee.last_name) AS name FROM employee`

            db.query(sql, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                const employeeNames = rows.map(obj => obj.name);
                resolve(employeeNames);
            });

        });
    };

    async getEmployeeIds(employeeName) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id from employee WHERE CONCAT_WS(' ', employee.first_name, employee.last_name) = ?`
            const params = employeeName

            db.query(sql, params, (err, rows) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                const employeeId = rows.map(obj => obj.id)[0];
                resolve(employeeId);
            });

        });
    };

    // async getManagers() {
    //     return new Promise((resolve, reject) => {
    //         const sql = `SELECT DISTINCT CONCAT_WS(' ', m.first_name, m.last_name) AS managers
    //         FROM employee e
    //         LEFT JOIN employee m on e.manager_id = m.id`;

    //         db.query(sql, (err, rows) => {
    //             if (err) {
    //                 console.log(err.message)
    //                 return;
    //             }
    //             resolve(rows);
    //         });

    //     });
    // };

    async addDepartment(name) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO department (dept_name) VALUES (?)`;
            const params = name;
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                resolve(console.log(`New ${name} department has been created`));
            });

        });
    };

    async addRole(title, salary, department_id) {
        const departmentId = await this.getDepartmentIds(department_id)
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
            const params = [title, salary, departmentId];
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                resolve(console.log(`New ${title} role has been created`));
            });

        });
    };

    async addEmployee(first_name, last_name, role_id, manager_id) {
        const roleId = await this.getRoleIds(role_id)
        const managerId = await this.getEmployeeIds(manager_id)
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
            const params = [first_name, last_name, roleId, managerId];
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                resolve(console.log(`${first_name} ${last_name} added to database`));
            });

        });
    };

    async updateEmployee(employee_name, role_id) {
        const employeeId = await this.getEmployeeIds(employee_name)
        const roleId = await this.getRoleIds(role_id)
        return new Promise((resolve, reject) => {
            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
            const params = [roleId, employeeId];
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err.message)
                    return;
                }
                resolve(console.log(`Role updated`));
            });

        });
    };
}

module.exports = Database;
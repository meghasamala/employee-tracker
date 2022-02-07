const inquirer = require('inquirer');
const cTable = require('console.table')
const Database = require('./queries.js');
const db = new Database;

const startTracker = async function() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'main',
            message: 'Choose an action from the following options: ',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department',
             'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
        }
    ])

    .then(async (answer) => {
        const choice = answer.main;
        if (choice === 'View all departments') {
            const departments = await db.getDepartments();
            console.table(departments)
        } else if (choice === 'View all roles') {
            const roles = await db.getRoles();
            console.table(roles)
        } else if (choice === 'View all employees') {
            const employees = await db.getEmployees();
            console.table(employees)
        } else if (choice === 'Add a department') {
            return deptPrompt();
        } else if (choice === 'Add a role') {
            return rolePrompt();
        } else if (choice === 'Add an employee') {
            return employeePrompt();
        } else if (choice === 'Update an employee role') {
            return updatePrompt();
        } else if (choice === 'Exit') {
            return;
        }
    });
};

const deptPrompt = async function() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'dept',
            message: 'Choose an option: ',
            choices: ['Add a department', 'Back to menu']
        },
        {
            type: 'input',
            name: 'name',
            message: 'Enter the name of the new department: ',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('You must enter a name to create the new department.')
                    return false;
                }
            },
            when: ({dept}) => {
                if (dept === 'Add a department') {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ])

    .then(async (answer) => {
        const choice = answer.dept;
        if (choice === 'Add a department') {
            await db.addDepartment(answer.name);
        } else if (choice === 'Back to menu') {
            return startTracker();
        }
        return startTracker();
    })

}

const rolePrompt = async function() {
    const deptNames = await db.getDepartmentNames();
    return inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Choose an option: ',
            choices: ['Add a role', 'Back to menu']
        },
        {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the new role: ',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                } else {
                    console.log('You must enter a title to create a new role.')
                    return false;
                }
            },
            when: ({role}) => {
                if (role === 'Add a role') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary of the new role: ',
            validate: salaryInput => {
                if (salaryInput) {
                    return true;
                } else {
                    console.log('You must enter a salary to create a new role.')
                    return false;
                }
            },
            when: ({role}) => {
                if (role === 'Add a role') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'dept_id',
            message: 'Enter the department of the new role: ',
            choices: deptNames,
            when: ({role}) => {
                if (role === 'Add a role') {
                    return true;
                } else {
                    return false;
                }
            }
        },

    ])

    .then(async (answer) => {
        const choice = answer.role;
        if (choice === 'Add a role') {
            await db.addRole(answer.title, answer.salary, answer.dept_id);
        } else if (choice === 'Back to menu') {
            return startTracker();
        }
        return startTracker();
    })

}

const employeePrompt = async function() {
    const roleTitles = await db.getRoleTitles();
    const managerChoices = await db.getEmployeeNames();
    managerChoices.push('None');
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Choose an option: ',
            choices: ['Add an employee', 'Back to menu']
        },
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the first name of the new employee: ',
            validate: firstNameInput => {
                if (firstNameInput) {
                    return true;
                } else {
                    console.log('You must enter the first name of the new employee.')
                    return false;
                }
            },
            when: ({employee}) => {
                if (employee === 'Add an employee') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the last name of the new employee: ',
            validate: lastNameInput => {
                if (lastNameInput) {
                    return true;
                } else {
                    console.log('You must enter the last name of the new employee.')
                    return false;
                }
            },
            when: ({employee}) => {
                if (employee === 'Add an employee') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'role_id',
            message: 'Choose the role of the new employee: ',
            choices: roleTitles,
            when: ({employee}) => {
                if (employee === 'Add an employee') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Select the manager of the new employee: ',
            choices: managerChoices,
            when: ({employee}) => {
                if (employee === 'Add an employee') {
                    return true;
                } else {
                    return false;
                }
            }
        },

    ])

    .then(async (answer) => {
        const choice = answer.employee;
        if (choice === 'Add an employee') {
            await db.addEmployee(answer.first_name, answer.last_name, answer.role_id, answer.manager);
        } else if (choice === 'Back to menu') {
            return startTracker();
        }
        return startTracker();
    })

}

const updatePrompt = async function() {
    const roleTitles = await db.getRoleTitles();
    const employeeNames = await db.getEmployeeNames();
    return inquirer.prompt([
        {
            type: 'list',
            name: 'update',
            message: 'Choose an option: ',
            choices: ['Update an employee role', 'Back to menu']
        },
        {
            type: 'list',
            name: 'employee_name',
            message: 'Select the employee whose role is to be updated: ',
            choices: employeeNames,
            when: ({update}) => {
                if (update === 'Update an employee role') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'new_role',
            message: 'Choose the new role of the employee: ',
            choices: roleTitles,
            when: ({update}) => {
                if (update === 'Update an employee role') {
                    return true;
                } else {
                    return false;
                }
            }
        },

    ])

    .then(async (answer) => {
        const choice = answer.update;
        if (choice === 'Update an employee role') {
            await db.updateEmployee(answer.employee_name, answer.new_role);
        } else if (choice === 'Back to menu') {
            return startTracker();
        }
        return startTracker();
    })

}

startTracker();
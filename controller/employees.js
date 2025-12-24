const DataManager = require('../utils/dataManager');
const manager = new DataManager('employee.json');

async function getEmployees(req, res) {
    try {
        const data = await manager.readData();
        res.json(data.employees || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getEmployeeById(req, res) {
    try {
        const data = await manager.readData();
        const employee = (data.employees || []).find(emp => emp.id === req.params.id);
        
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ error: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createEmployee(req, res) {
    try {
        const data = await manager.readData();
        
        const newEmployee = req.body && Object.keys(req.body).length > 0 
            ? { id: manager.generateId(), ...req.body }
            : manager.generateRandomData('employees');
        
        data.employees = data.employees || [];
        data.employees.push(newEmployee);
        
        await manager.writeData(data);
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateEmployee(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.employees || []).findIndex(emp => emp.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : manager.generateRandomData('employees');
        
        delete updatedData.id;
        
        data.employees[index] = { ...data.employees[index], ...updatedData };
        
        await manager.writeData(data);
        res.json(data.employees[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function patchEmployee(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.employees || []).findIndex(emp => emp.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        const patchData = req.body || {};
        
        delete patchData.id;
        
        const originalEmployee = data.employees[index];
        
        if (patchData.age && typeof patchData.age === 'number') {
            patchData.age = originalEmployee.age + 1;
        }
        
        data.employees[index] = { ...originalEmployee, ...patchData };
        
        await manager.writeData(data);
        res.json(data.employees[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteEmployee(req, res) {
    try {
        const data = await manager.readData();
        const initialLength = (data.employees || []).length;
        
        data.employees = (data.employees || []).filter(emp => emp.id !== req.params.id);
        
        if (data.employees.length === initialLength) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        
        await manager.writeData(data);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    patchEmployee,
    deleteEmployee
};
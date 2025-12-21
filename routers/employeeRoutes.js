const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../employees.json');

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { employees: [] };
    }
}

async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

const employeeHandlers = {
    // GET /employees - все сотрудники
    async getAll(req, res) {
        try {
            const data = await readData();
            res.json(data.employees || []);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка чтения сотрудников' });
        }
    },
    
    // GET /employees/:id - сотрудник по ID
    async getById(req, res) {
        try {
            const data = await readData();
            const employee = (data.employees || []).find(e => e.id === req.params.id);
            
            if (!employee) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }
            
            res.json(employee);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },
    
    // POST /employees - создать сотрудника
    async create(req, res) {
        try {
            const data = await readData();
            const employees = data.employees || [];
            
            const newEmployee = {
                id: req.body.id || `emp${Date.now()}`,
                ...req.body,
                age: req.body.age || 18,
                isFullTime: req.body.isFullTime || false,
                hireDate: req.body.hireDate || new Date().toISOString().split('T')[0]
            };
            
            employees.push(newEmployee);
            await writeData({ ...data, employees });
            
            res.status(201).json(newEmployee);
        } catch (error) {
            res.status(400).json({ error: 'Неверные данные сотрудника' });
        }
    },
    
    // PUT /employees/:id - обновить сотрудника
    async update(req, res) {
        try {
            const data = await readData();
            const employees = data.employees || [];
            const index = employees.findIndex(e => e.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }
            
            employees[index] = {
                ...employees[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeData({ ...data, employees });
            res.json(employees[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления сотрудника' });
        }
    },
    
    // PATCH /employees/:id - частично обновить
    async patch(req, res) {
        try {
            const data = await readData();
            const employees = data.employees || [];
            const index = employees.findIndex(e => e.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }
            
            Object.keys(req.body).forEach(key => {
                employees[index][key] = req.body[key];
            });
            
            employees[index].patchedAt = new Date().toISOString();
            await writeData({ ...data, employees });
            
            res.json(employees[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления сотрудника' });
        }
    },
    
    // DELETE /employees/:id - удалить сотрудника
    async delete(req, res) {
        try {
            const data = await readData();
            const employees = data.employees || [];
            const index = employees.findIndex(e => e.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Сотрудник не найден' });
            }
            
            const deleted = employees.splice(index, 1)[0];
            await writeData({ ...data, employees });
            
            res.json({ message: 'Сотрудник удален', employee: deleted });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления сотрудника' });
        }
    }
};

module.exports = employeeHandlers;
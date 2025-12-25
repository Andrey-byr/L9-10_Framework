const BaseController = require('./BaseController');

class EmployeeController extends BaseController {
    constructor() { super('employee.json', 'employees'); }

    patch = async (req, res) => {
        try {
            const data = await this.manager.readData();
            const items = data.employees || [];
            const index = items.findIndex(e => e.id === req.params.id);

            if (index === -1) return res.status(404).json({ error: 'Employee not found' });

            const original = items[index];
            const patchData = req.body || {};
            const updatedFields = {};

            Object.keys(patchData).forEach(key => {
                    updatedFields[key] = patchData[key];
            });

            data.employees[index] = { ...original, ...updatedFields, id: original.id };
            await this.manager.writeData(data);
            res.json(data.employees[index]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new EmployeeController();
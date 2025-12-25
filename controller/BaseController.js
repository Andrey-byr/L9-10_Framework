const DataManager = require('../utils/dataManager');

class BaseController {
    constructor(fileName, resourceKey) {
        this.manager = new DataManager(fileName);
        this.resourceKey = resourceKey;
    }

    getAll = async (req, res) => {
        const data = await this.manager.readData();
        res.json(data[this.resourceKey] || []);
    };

    getById = async (req, res) => {
        const data = await this.manager.readData();
        const item = (data[this.resourceKey] || []).find(i => i.id === req.params.id);
        item ? res.json(item) : res.status(404).json({ error: `${this.resourceKey} not found` });
    };

    create = async (req, res) => {
        const data = await this.manager.readData();
        const newItem = req.body && Object.keys(req.body).length > 0 
            ? { id: this.manager.generateId(), ...req.body }
            : this.manager.generateRandomData(this.resourceKey);
        
        data[this.resourceKey] = data[this.resourceKey] || [];
        data[this.resourceKey].push(newItem);
        await this.manager.writeData(data);
        res.status(201).json(newItem);
    };

    update = async (req, res) => {
        try {
            const data = await this.manager.readData();
            const index = (data[this.resourceKey] || []).findIndex(i => i.id === req.params.id);
            if (index === -1) return res.status(404).json({ error: 'Not found' });
            const updatedData = req.body && Object.keys(req.body).length > 0
                ? req.body : this.manager.generateRandomData(this.resourceKey);
            delete updatedData.id;
            data[this.resourceKey][index] = { ...data[this.resourceKey][index], ...updatedData };
            await this.manager.writeData(data);
            res.json(data[this.resourceKey][index]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    delete = async (req, res) => {
        try {
            const data = await this.manager.readData();
            const initialLength = (data[this.resourceKey] || []).length;
            data[this.resourceKey] = (data[this.resourceKey] || []).filter(i => i.id !== req.params.id);
            if (data[this.resourceKey].length === initialLength) return res.status(404).json({ error: 'Not found' });
            await this.manager.writeData(data);
            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = BaseController;
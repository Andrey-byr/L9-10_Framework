
const DataManager = require('../utils/dataManager');

function getManager(resource) {
    const resourceMap = {
        'employees': 'employee.json',
        'spectacles': 'spectacle.json',
        'streamers': 'streamer.json',
        'streams': 'stream.json',
        'films': 'films.json',
        'cinemas': 'cinemas.json'
    };
    
    const fileName = resourceMap[resource] || `${resource}.json`;
    return new DataManager(fileName);
}

function _randomArray(options) {
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...options].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function getAll(req, res) {
    try {
        const { resource } = req.params; 
        const manager = getManager(resource);
        const data = await manager.readData();
        res.json(data[resource] || data[resource.slice(0, -1)] || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getById(req, res) {
    try {
        const { resource, id } = req.params;
        const manager = getManager(resource);
        const data = await manager.readData();
        const items = data[resource] || [];
        
        const item = items.find(i => i.id === id || i.username === id);
        
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: `${resource} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function create(req, res) {
    try {
        const { resource } = req.params;
        const manager = getManager(resource);
        const data = await manager.readData();
        
        let newItem = req.body && Object.keys(req.body).length > 0 
            ? { ...req.body }
            : manager.generateRandomData(resource);

        if (!newItem.id && !newItem.username) {
            newItem.id = manager.generateId();
        }

        data[resource] = data[resource] || [];
        data[resource].push(newItem);
        
        await manager.writeData(data);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function update(req, res) {
    try {
        const { resource, id } = req.params;
        const manager = getManager(resource);
        const data = await manager.readData();
        const items = data[resource] || [];
        
        const index = items.findIndex(i => i.id === id || i.username === id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : manager.generateRandomData(resource);
        
        delete updatedData.id;
        
        data[resource][index] = { ...data[resource][index], ...updatedData };
        
        await manager.writeData(data);
        res.json(data[resource][index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function remove(req, res) {
    try {
        const { resource, id } = req.params;
        const manager = getManager(resource);
        const data = await manager.readData();
        
        const initialLength = (data[resource] || []).length;
        data[resource] = (data[resource] || []).filter(i => i.id !== id && i.username !== id);
        
        if (data[resource].length === initialLength) {
            return res.status(404).json({ error: 'Item not found' });
        }
        
        await manager.writeData(data);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
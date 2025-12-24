const DataManager = require('../utils/dataManager');
const manager = new DataManager('spectacle.json');

async function getSpectacles(req, res) {
    try {
        const data = await manager.readData();
        res.json(data.spectacles || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getSpectacleById(req, res) {
    try {
        const data = await manager.readData();
        const spectacle = (data.spectacles || []).find(s => s.id === req.params.id);
        
        if (spectacle) {
            res.json(spectacle);
        } else {
            res.status(404).json({ error: 'Spectacle not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createSpectacle(req, res) {
    try {
        const data = await manager.readData();
        
        const newSpectacle = req.body && Object.keys(req.body).length > 0 
            ? { id: manager.generateId(), ...req.body }
            : manager.generateRandomData('spectacles');
        
        data.spectacles = data.spectacles || [];
        data.spectacles.push(newSpectacle);
        
        await manager.writeData(data);
        res.status(201).json(newSpectacle);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateSpectacle(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.spectacles || []).findIndex(s => s.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Spectacle not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : manager.generateRandomData('spectacles');
        
        delete updatedData.id;
        
        data.spectacles[index] = { ...data.spectacles[index], ...updatedData };
        
        await manager.writeData(data);
        res.json(data.spectacles[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function patchSpectacle(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.spectacles || []).findIndex(s => s.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Spectacle not found' });
        }
        
        const patchData = req.body || {};
        delete patchData.id;
        
        const originalSpectacle = data.spectacles[index];
        
        if (patchData.year && typeof patchData.year === 'number') {
            patchData.year = originalSpectacle.year + Math.floor(Math.random() * 10);
        }
        
        data.spectacles[index] = { ...originalSpectacle, ...patchData };
        
        await manager.writeData(data);
        res.json(data.spectacles[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteSpectacle(req, res) {
    try {
        const data = await manager.readData();
        const initialLength = (data.spectacles || []).length;
        
        data.spectacles = (data.spectacles || []).filter(s => s.id !== req.params.id);
        
        if (data.spectacles.length === initialLength) {
            return res.status(404).json({ error: 'Spectacle not found' });
        }
        
        await manager.writeData(data);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getSpectacles,
    getSpectacleById,
    createSpectacle,
    updateSpectacle,
    patchSpectacle,
    deleteSpectacle
};
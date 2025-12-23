const DataManager = require('../utils/dataManager');
const manager = new DataManager('cinemas.json');

async function getCinemas(req, res) {
    try {
        const data = await manager.readData();
        res.json(data.cinemas || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getCinemaById(req, res) {
    try {
        const data = await manager.readData();
        const cinema = (data.cinemas || []).find(c => c.id === req.params.id);
        
        if (cinema) {
            res.json(cinema);
        } else {
            res.status(404).json({ error: 'Cinema not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createCinema(req, res) {
    try {
        const data = await manager.readData();
        
        const newCinema = req.body && Object.keys(req.body).length > 0 
            ? { id: manager.generateId(), ...req.body }
            : manager.generateRandomData('cinemas');
        
        data.cinemas = data.cinemas || [];
        data.cinemas.push(newCinema);
        
        await manager.writeData(data);
        res.status(201).json(newCinema);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateCinema(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.cinemas || []).findIndex(c => c.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Cinema not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : manager.generateRandomData('cinemas');
        
        delete updatedData.id;
        
        data.cinemas[index] = { ...data.cinemas[index], ...updatedData };
        
        await manager.writeData(data);
        res.json(data.cinemas[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function patchCinema(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.cinemas || []).findIndex(c => c.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Cinema not found' });
        }
        
        const patchData = req.body || {};
        delete patchData.id;
        
        const originalCinema = data.cinemas[index];
        
        if (patchData.totalHalls && typeof patchData.totalHalls === 'number') {
            patchData.totalHalls = originalCinema.totalHalls + Math.floor(Math.random() * 5);
        }
        
        data.cinemas[index] = { ...originalCinema, ...patchData };
        
        await manager.writeData(data);
        res.json(data.cinemas[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteCinema(req, res) {
    try {
        const data = await manager.readData();
        const initialLength = (data.cinemas || []).length;
        
        data.cinemas = (data.cinemas || []).filter(c => c.id !== req.params.id);
        
        if (data.cinemas.length === initialLength) {
            return res.status(404).json({ error: 'Cinema not found' });
        }
        
        await manager.writeData(data);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    patchCinema,
    deleteCinema
};
const DataManager = require('../utils/dataManager');
const manager = new DataManager('streamer.json');

async function getStreamers(req, res) {
    try {
        const data = await manager.readData();
        res.json(data.streamer || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getStreamerById(req, res) {
    try {
        const data = await manager.readData();
        const streamer = (data.streamer || []).find(s => s.id === req.params.id);
        
        if (streamer) {
            res.json(streamer);
        } else {
            res.status(404).json({ error: 'Streamer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createStreamer(req, res) {
    try {
        const data = await manager.readData();
        
        const newStreamer = req.body && Object.keys(req.body).length > 0 
            ? { id: manager.generateId(), ...req.body }
            : manager.generateRandomData('streamer');
        
        data.streamer = data.streamer || [];
        data.streamer.push(newStreamer);
        
        await manager.writeData(data);
        res.status(201).json(newStreamer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateStreamer(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.streamer || []).findIndex(s => s.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Streamer not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : manager.generateRandomData('streamer');
        
        delete updatedData.id;
        data.streamer[index] = { ...data.streamer[index], ...updatedData };
        
        await manager.writeData(data);
        res.json(data.streamer[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function patchStreamer(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.streamer || []).findIndex(s => s.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Streamer not found' });
        }
        
        const patchData = req.body || {};
        delete patchData.id;
        
        const original = data.streamer[index];
        
        // Логика по аналогии с изменением года: прибавляем случайное число к подписчикам
        if (patchData.followers && typeof patchData.followers === 'number') {
            patchData.followers = original.followers + Math.floor(Math.random() * 100);
        }
        
        data.streamer[index] = { ...original, ...patchData };
        
        await manager.writeData(data);
        res.json(data.streamer[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteStreamer(req, res) {
    try {
        const data = await manager.readData();
        const initialLength = (data.streamer || []).length;
        
        data.streamer = (data.streamer || []).filter(s => s.id !== req.params.id);
        
        if (data.streamer.length === initialLength) {
            return res.status(404).json({ error: 'Streamer not found' });
        }
        
        await manager.writeData(data);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getStreamers,
    getStreamerById,
    createStreamer,
    updateStreamer,
    patchStreamer,
    deleteStreamer
};
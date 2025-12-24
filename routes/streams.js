const DataManager = require('../utils/dataManager');
const manager = new DataManager('stream.json');

async function getStreams(req, res) {
    try {
        const data = await manager.readData();
        res.json(data.stream || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getStreamById(req, res) {
    try {
        const data = await manager.readData();
        const stream = (data.stream || []).find(s => s.id === req.params.id);
        
        if (stream) {
            res.json(stream);
        } else {
            res.status(404).json({ error: 'Stream not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createStream(req, res) {
    try {
        const data = await manager.readData();
        
        const newStream = req.body && Object.keys(req.body).length > 0 
            ? { id: manager.generateId(), ...req.body }
            : manager.generateRandomData('stream');
        
        data.stream = data.stream || [];
        data.stream.push(newStream);
        
        await manager.writeData(data);
        res.status(201).json(newStream);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateStream(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.stream || []).findIndex(s => s.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Stream not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : manager.generateRandomData('stream');
        
        delete updatedData.id;
        data.stream[index] = { ...data.stream[index], ...updatedData };
        
        await manager.writeData(data);
        res.json(data.stream[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function patchStream(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.stream || []).findIndex(s => s.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Stream not found' });
        }
        
        const patchData = req.body || {};
        delete patchData.id;
        
        const original = data.stream[index];
        
        if (patchData.viewers && typeof patchData.viewers === 'number') {
            patchData.viewers = original.viewers + Math.floor(Math.random() * 50);
        }
        
        data.stream[index] = { ...original, ...patchData };
        
        await manager.writeData(data);
        res.json(data.stream[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteStream(req, res) {
    try {
        const data = await manager.readData();
        const initialLength = (data.stream || []).length;
        
        data.stream = (data.stream || []).filter(s => s.id !== req.params.id);
        
        if (data.stream.length === initialLength) {
            return res.status(404).json({ error: 'Stream not found' });
        }
        
        await manager.writeData(data);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getStreams,
    getStreamById,
    createStream,
    updateStream,
    patchStream,
    deleteStream
};
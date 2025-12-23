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

async function getStreamByTitle(req, res) {
    try {
        const data = await manager.readData();
        const stream = (data.stream || []).find(s => 
            s.title.toLowerCase().includes(req.params.title.toLowerCase())
        );
        
        if (stream) {
            res.json(stream);
        } else {
            res.status(404).json({ error: 'Stream not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getStreamById(req, res) {
    try {
        const data = await manager.readData();
        const streams = data.stream || [];
        const index = parseInt(req.params.id);
        
        if (index >= 0 && index < streams.length) {
            res.json(streams[index]);
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
            ? { ...req.body }
            : {
                title: `Stream ${Math.floor(Math.random() * 1000)}`,
                viewers: Math.floor(Math.random() * 10000),
                moderationEnabled: Math.random() > 0.5,
                startedAt: new Date().toISOString(),
                moderators: this._randomArray(['ModAlex', 'ModKate', 'ModJohn', 'ModAnna', 'ModMike'])
            };
        
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
        const index = parseInt(req.params.id);
        
        if (index < 0 || index >= (data.stream || []).length) {
            return res.status(404).json({ error: 'Stream not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : {
                title: `Updated Stream ${Math.floor(Math.random() * 1000)}`,
                viewers: Math.floor(Math.random() * 10000),
                moderationEnabled: Math.random() > 0.5,
                startedAt: new Date().toISOString(),
                moderators: this._randomArray(['ModAlex', 'ModKate', 'ModJohn', 'ModAnna', 'ModMike'])
            };
        
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
        const index = parseInt(req.params.id);
        
        if (index < 0 || index >= (data.stream || []).length) {
            return res.status(404).json({ error: 'Stream not found' });
        }
        
        const patchData = req.body || {};
        
        const originalStream = data.stream[index];
        
        if (patchData.viewers && typeof patchData.viewers === 'number') {
            patchData.viewers = originalStream.viewers + Math.floor(Math.random() * 500);
        }
        
        if (typeof patchData.moderationEnabled === 'boolean') {
            patchData.moderationEnabled = !originalStream.moderationEnabled;
        }
        
        if (patchData.moderators && Array.isArray(patchData.moderators)) {
            const newModerators = ['ModAlex', 'ModKate', 'ModJohn', 'ModAnna', 'ModMike'];
            const randomMod = newModerators[Math.floor(Math.random() * newModerators.length)];
            
            if (!patchData.moderators.includes(randomMod)) {
                patchData.moderators.push(randomMod);
            }
        }
        
        data.stream[index] = { ...originalStream, ...patchData };
        
        await manager.writeData(data);
        res.json(data.stream[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteStream(req, res) {
    try {
        const data = await manager.readData();
        const index = parseInt(req.params.id);
        
        if (index < 0 || index >= (data.stream || []).length) {
            return res.status(404).json({ error: 'Stream not found' });
        }
        
        data.stream.splice(index, 1);
        
        await manager.writeData(data);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function _randomArray(options) {
    const count = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...options].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

module.exports._randomArray = _randomArray;

module.exports = {
    getStreams,
    getStreamByTitle,
    getStreamById,
    createStream,
    updateStream,
    patchStream,
    deleteStream
};
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
        const streamer = (data.streamer || []).find(s => s.username === req.params.username);
        
        if (streamer) {
            res.json(streamer);
        } else {
            res.status(404).json({ error: 'Streamer not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getStreamerByUsername(req, res) {
    try {
        const data = await manager.readData();
        const streamer = (data.streamer || []).find(s => 
            s.username.toLowerCase() === req.params.username.toLowerCase()
        );
        
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
            ? { ...req.body }
            : {
                username: `Streamer${Math.floor(Math.random() * 10000)}`,
                category: ['Just Chatting', 'Gaming', 'Music', 'Art', 'IRL'][Math.floor(Math.random() * 5)],
                followers: Math.floor(Math.random() * 1000000),
                isLive: Math.random() > 0.5,
                channelCreated: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                tags: this._randomArray(['RU', 'EN', 'Gaming', 'Chat', 'Music', 'Art', 'Funny'])
            };
        
        const existingStreamer = (data.streamer || []).find(s => 
            s.username === newStreamer.username
        );
        
        if (existingStreamer) {
            return res.status(400).json({ error: 'Streamer with this username already exists' });
        }
        
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
        const index = (data.streamer || []).findIndex(s => s.username === req.params.username);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Streamer not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : {
                username: `UpdatedStreamer${Math.floor(Math.random() * 10000)}`,
                category: ['Just Chatting', 'Gaming', 'Music', 'Art', 'IRL'][Math.floor(Math.random() * 5)],
                followers: Math.floor(Math.random() * 1000000),
                isLive: Math.random() > 0.5,
                channelCreated: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                tags: this._randomArray(['RU', 'EN', 'Gaming', 'Chat', 'Music', 'Art', 'Funny'])
            };
        
        if (updatedData.username && updatedData.username !== data.streamer[index].username) {
            const usernameExists = (data.streamer || []).some((s, i) => 
                i !== index && s.username === updatedData.username
            );
            
            if (usernameExists) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }
        
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
        const index = (data.streamer || []).findIndex(s => s.username === req.params.username);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Streamer not found' });
        }
        
        const patchData = req.body || {};
        
        const originalStreamer = data.streamer[index];
        
        if (patchData.followers && typeof patchData.followers === 'number') {
            patchData.followers = originalStreamer.followers + Math.floor(Math.random() * 1000);
        }
        
        if (typeof patchData.isLive === 'boolean') {
            patchData.isLive = !originalStreamer.isLive;
        }
        
        if (patchData.username && patchData.username !== originalStreamer.username) {
            const usernameExists = (data.streamer || []).some((s, i) => 
                i !== index && s.username === patchData.username
            );
            
            if (usernameExists) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }
        
        data.streamer[index] = { ...originalStreamer, ...patchData };
        
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
        
        data.streamer = (data.streamer || []).filter(s => s.username !== req.params.username);
        
        if (data.streamer.length === initialLength) {
            return res.status(404).json({ error: 'Streamer not found' });
        }
        
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
    getStreamers,
    getStreamerById,
    getStreamerByUsername,
    createStreamer,
    updateStreamer,
    patchStreamer,
    deleteStreamer
};
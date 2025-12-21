const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../streamer.json');

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

function generateId(items) {
    return items.length > 0 ? Math.max(...items.map(i => i.id || 0)) + 1 : 1;
}

const streamerHandlers = {
    // GET /streamers - все стримеры
    async getAll(req, res) {
        try {
            const streamers = await readData();
            res.json(streamers);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка чтения стримеров' });
        }
    },
    
    // GET /streamers/:username - стример по username
    async getByUsername(req, res) {
        try {
            const streamers = await readData();
            const streamer = streamers.find(s => s.username === req.params.username);
            
            if (!streamer) {
                return res.status(404).json({ error: 'Стример не найден' });
            }
            
            res.json(streamer);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },
    
    // POST /streamers - создать стримера
    async create(req, res) {
        try {
            const streamers = await readData();
            const newStreamer = {
                id: generateId(streamers),
                ...req.body,
                followers: req.body.followers || 0,
                isLive: req.body.isLive || false,
                channelCreated: req.body.channelCreated || new Date().toISOString()
            };
            
            streamers.push(newStreamer);
            await writeData(streamers);
            
            res.status(201).json(newStreamer);
        } catch (error) {
            res.status(400).json({ error: 'Неверные данные стримера' });
        }
    },
    
    // PUT /streamers/:username - обновить стримера
    async update(req, res) {
        try {
            const streamers = await readData();
            const index = streamers.findIndex(s => s.username === req.params.username);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Стример не найден' });
            }
            
            streamers[index] = {
                ...streamers[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeData(streamers);
            res.json(streamers[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления стримера' });
        }
    },
    
    // PATCH /streamers/:username - частично обновить
    async patch(req, res) {
        try {
            const streamers = await readData();
            const index = streamers.findIndex(s => s.username === req.params.username);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Стример не найден' });
            }
            
            Object.keys(req.body).forEach(key => {
                streamers[index][key] = req.body[key];
            });
            
            streamers[index].patchedAt = new Date().toISOString();
            await writeData(streamers);
            
            res.json(streamers[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления стримера' });
        }
    },
    
    // DELETE /streamers/:username - удалить стримера
    async delete(req, res) {
        try {
            const streamers = await readData();
            const index = streamers.findIndex(s => s.username === req.params.username);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Стример не найден' });
            }
            
            const deleted = streamers.splice(index, 1)[0];
            await writeData(streamers);
            
            res.json({ message: 'Стример удален', streamer: deleted });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления стримера' });
        }
    }
};

module.exports = streamerHandlers;
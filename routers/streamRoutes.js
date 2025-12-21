const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../stream.json');

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

const streamHandlers = {
    // GET /streams - все стримы
    async getAll(req, res) {
        try {
            const streams = await readData();
            res.json(streams);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка чтения стримов' });
        }
    },
    
    // GET /streams/:id - один стрим
    async getById(req, res) {
        try {
            const streams = await readData();
            const stream = streams.find(s => s.id == req.params.id || s.title === req.params.id);
            
            if (!stream) {
                return res.status(404).json({ error: 'Стрим не найден' });
            }
            
            res.json(stream);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },
    
    // POST /streams - создать стрим
    async create(req, res) {
        try {
            const streams = await readData();
            const newStream = {
                id: generateId(streams),
                ...req.body,
                startedAt: req.body.startedAt || new Date().toISOString(),
                viewers: req.body.viewers || 0
            };
            
            streams.push(newStream);
            await writeData(streams);
            
            res.status(201).json(newStream);
        } catch (error) {
            res.status(400).json({ error: 'Неверные данные стрима' });
        }
    },
    
    // PUT /streams/:id - обновить полностью
    async update(req, res) {
        try {
            const streams = await readData();
            const index = streams.findIndex(s => s.id == req.params.id || s.title === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Стрим не найден' });
            }
            
            streams[index] = {
                ...streams[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeData(streams);
            res.json(streams[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления стрима' });
        }
    },
    
    // PATCH /streams/:id - обновить частично
    async patch(req, res) {
        try {
            const streams = await readData();
            const index = streams.findIndex(s => s.id == req.params.id || s.title === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Стрим не найден' });
            }
            
            Object.keys(req.body).forEach(key => {
                streams[index][key] = req.body[key];
            });
            
            streams[index].patchedAt = new Date().toISOString();
            await writeData(streams);
            
            res.json(streams[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления стрима' });
        }
    },
    
    // DELETE /streams/:id - удалить стрим
    async delete(req, res) {
        try {
            const streams = await readData();
            const index = streams.findIndex(s => s.id == req.params.id || s.title === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Стрим не найден' });
            }
            
            const deleted = streams.splice(index, 1)[0];
            await writeData(streams);
            
            res.json({ message: 'Стрим удален', stream: deleted });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления стрима' });
        }
    }
};

module.exports = streamHandlers;
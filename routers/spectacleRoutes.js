const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../spectacle.json');

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { spectacles: [] };
    }
}

async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

const spectacleHandlers = {
    // GET /spectacles - все спектакли
    async getAll(req, res) {
        try {
            const data = await readData();
            res.json(data.spectacles || []);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка чтения спектаклей' });
        }
    },
    
    // GET /spectacles/:id - спектакль по ID
    async getById(req, res) {
        try {
            const data = await readData();
            const spectacle = (data.spectacles || []).find(s => s.id === req.params.id);
            
            if (!spectacle) {
                return res.status(404).json({ error: 'Спектакль не найден' });
            }
            
            res.json(spectacle);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },
    
    // POST /spectacles - создать спектакль
    async create(req, res) {
        try {
            const data = await readData();
            const spectacles = data.spectacles || [];
            
            const newSpectacle = {
                id: req.body.id || `sp${Date.now()}`,
                ...req.body,
                isPremiere: req.body.isPremiere || false,
                year: req.body.year || new Date().getFullYear()
            };
            
            spectacles.push(newSpectacle);
            await writeData({ ...data, spectacles });
            
            res.status(201).json(newSpectacle);
        } catch (error) {
            res.status(400).json({ error: 'Неверные данные спектакля' });
        }
    },
    
    // PUT /spectacles/:id - обновить спектакль
    async update(req, res) {
        try {
            const data = await readData();
            const spectacles = data.spectacles || [];
            const index = spectacles.findIndex(s => s.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Спектакль не найден' });
            }
            
            spectacles[index] = {
                ...spectacles[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeData({ ...data, spectacles });
            res.json(spectacles[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления спектакля' });
        }
    },
    
    // PATCH /spectacles/:id - частично обновить
    async patch(req, res) {
        try {
            const data = await readData();
            const spectacles = data.spectacles || [];
            const index = spectacles.findIndex(s => s.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Спектакль не найден' });
            }
            
            Object.keys(req.body).forEach(key => {
                spectacles[index][key] = req.body[key];
            });
            
            spectacles[index].patchedAt = new Date().toISOString();
            await writeData({ ...data, spectacles });
            
            res.json(spectacles[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления спектакля' });
        }
    },
    
    // DELETE /spectacles/:id - удалить спектакль
    async delete(req, res) {
        try {
            const data = await readData();
            const spectacles = data.spectacles || [];
            const index = spectacles.findIndex(s => s.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Спектакль не найден' });
            }
            
            const deleted = spectacles.splice(index, 1)[0];
            await writeData({ ...data, spectacles });
            
            res.json({ message: 'Спектакль удален', spectacle: deleted });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления спектакля' });
        }
    }
};

module.exports = spectacleHandlers;
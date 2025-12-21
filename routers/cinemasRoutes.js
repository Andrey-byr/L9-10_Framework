const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../cinemas.json');

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { cinemas: [] };
    }
}

async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

const cinemaHandlers = {
    // GET /cinemas - все кинотеатры
    async getAll(req, res) {
        try {
            const data = await readData();
            res.json(data.cinemas || []);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка чтения кинотеатров' });
        }
    },
    
    // GET /cinemas/:id - кинотеатр по ID
    async getById(req, res) {
        try {
            const data = await readData();
            const cinema = (data.cinemas || []).find(c => c.id === req.params.id);
            
            if (!cinema) {
                return res.status(404).json({ error: 'Кинотеатр не найден' });
            }
            
            res.json(cinema);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },
    
    // POST /cinemas - создать кинотеатр
    async create(req, res) {
        try {
            const data = await readData();
            const cinemas = data.cinemas || [];
            
            const newCinema = {
                id: req.body.id || `cin${Date.now()}`,
                ...req.body,
                totalHalls: req.body.totalHalls || 1,
                hasIMAX: req.body.hasIMAX || false,
                openingDate: req.body.openingDate || new Date().toISOString().split('T')[0]
            };
            
            cinemas.push(newCinema);
            await writeData({ ...data, cinemas });
            
            res.status(201).json(newCinema);
        } catch (error) {
            res.status(400).json({ error: 'Неверные данные кинотеатра' });
        }
    },
    
    // PUT /cinemas/:id - обновить кинотеатр
    async update(req, res) {
        try {
            const data = await readData();
            const cinemas = data.cinemas || [];
            const index = cinemas.findIndex(c => c.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Кинотеатр не найден' });
            }
            
            cinemas[index] = {
                ...cinemas[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeData({ ...data, cinemas });
            res.json(cinemas[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления кинотеатра' });
        }
    },
    
    // PATCH /cinemas/:id - частично обновить
    async patch(req, res) {
        try {
            const data = await readData();
            const cinemas = data.cinemas || [];
            const index = cinemas.findIndex(c => c.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Кинотеатр не найден' });
            }
            
            Object.keys(req.body).forEach(key => {
                cinemas[index][key] = req.body[key];
            });
            
            cinemas[index].patchedAt = new Date().toISOString();
            await writeData({ ...data, cinemas });
            
            res.json(cinemas[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления кинотеатра' });
        }
    },
    
    // DELETE /cinemas/:id - удалить кинотеатр
    async delete(req, res) {
        try {
            const data = await readData();
            const cinemas = data.cinemas || [];
            const index = cinemas.findIndex(c => c.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Кинотеатр не найден' });
            }
            
            const deleted = cinemas.splice(index, 1)[0];
            await writeData({ ...data, cinemas });
            
            res.json({ message: 'Кинотеатр удален', cinema: deleted });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления кинотеатра' });
        }
    }
};

module.exports = cinemaHandlers;
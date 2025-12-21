const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../films.json');

async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { films: [] };
    }
}

async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

const filmHandlers = {
    // GET /films - все фильмы
    async getAll(req, res) {
        try {
            const data = await readData();
            res.json(data.films || []);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка чтения фильмов' });
        }
    },
    
    // GET /films/:id - фильм по ID
    async getById(req, res) {
        try {
            const data = await readData();
            const film = (data.films || []).find(f => f.id === req.params.id);
            
            if (!film) {
                return res.status(404).json({ error: 'Фильм не найден' });
            }
            
            res.json(film);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    },
    
    // POST /films - создать фильм
    async create(req, res) {
        try {
            const data = await readData();
            const films = data.films || [];
            
            const newFilm = {
                id: req.body.id || `film${Date.now()}`,
                ...req.body,
                duration: req.body.duration || 90,
                is3D: req.body.is3D || false,
                releaseDate: req.body.releaseDate || new Date().toISOString().split('T')[0]
            };
            
            films.push(newFilm);
            await writeData({ ...data, films });
            
            res.status(201).json(newFilm);
        } catch (error) {
            res.status(400).json({ error: 'Неверные данные фильма' });
        }
    },
    
    // PUT /films/:id - обновить фильм
    async update(req, res) {
        try {
            const data = await readData();
            const films = data.films || [];
            const index = films.findIndex(f => f.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Фильм не найден' });
            }
            
            films[index] = {
                ...films[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            
            await writeData({ ...data, films });
            res.json(films[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления фильма' });
        }
    },
    
    // PATCH /films/:id - частично обновить
    async patch(req, res) {
        try {
            const data = await readData();
            const films = data.films || [];
            const index = films.findIndex(f => f.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Фильм не найден' });
            }
            
            Object.keys(req.body).forEach(key => {
                films[index][key] = req.body[key];
            });
            
            films[index].patchedAt = new Date().toISOString();
            await writeData({ ...data, films });
            
            res.json(films[index]);
        } catch (error) {
            res.status(400).json({ error: 'Ошибка обновления фильма' });
        }
    },
    
    // DELETE /films/:id - удалить фильм
    async delete(req, res) {
        try {
            const data = await readData();
            const films = data.films || [];
            const index = films.findIndex(f => f.id === req.params.id);
            
            if (index === -1) {
                return res.status(404).json({ error: 'Фильм не найден' });
            }
            
            const deleted = films.splice(index, 1)[0];
            await writeData({ ...data, films });
            
            res.json({ message: 'Фильм удален', film: deleted });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления фильма' });
        }
    }
};

module.exports = filmHandlers;
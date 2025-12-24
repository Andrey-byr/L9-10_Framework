const DataManager = require('../utils/dataManager');
const manager = new DataManager('films.json');

async function getFilms(req, res) {
    try {
        const data = await manager.readData();
        res.json(data.films || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getFilmById(req, res) {
    try {
        const data = await manager.readData();
        const film = (data.films || []).find(f => f.id === req.params.id);
        
        if (film) {
            res.json(film);
        } else {
            res.status(404).json({ error: 'Film not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createFilm(req, res) {
    try {
        const data = await manager.readData();
        
        const newFilm = req.body && Object.keys(req.body).length > 0 
            ? { id: manager.generateId(), ...req.body }
            : manager.generateRandomData('films');
        
        data.films = data.films || [];
        data.films.push(newFilm);
        
        await manager.writeData(data);
        res.status(201).json(newFilm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateFilm(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.films || []).findIndex(f => f.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Film not found' });
        }
        
        const updatedData = req.body && Object.keys(req.body).length > 0
            ? req.body
            : manager.generateRandomData('films');
        
        delete updatedData.id;
        
        data.films[index] = { ...data.films[index], ...updatedData };
        
        await manager.writeData(data);
        res.json(data.films[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function patchFilm(req, res) {
    try {
        const data = await manager.readData();
        const index = (data.films || []).findIndex(f => f.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Film not found' });
        }
        
        const patchData = req.body || {};
        delete patchData.id;
        
        const originalFilm = data.films[index];
        
        if (patchData.duration && typeof patchData.duration === 'number') {
            patchData.duration = originalFilm.duration + Math.floor(Math.random() * 30);
        }
        
        data.films[index] = { ...originalFilm, ...patchData };
        
        await manager.writeData(data);
        res.json(data.films[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteFilm(req, res) {
    try {
        const data = await manager.readData();
        const initialLength = (data.films || []).length;
        
        data.films = (data.films || []).filter(f => f.id !== req.params.id);
        
        if (data.films.length === initialLength) {
            return res.status(404).json({ error: 'Film not found' });
        }
        
        await manager.writeData(data);
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getFilms,
    getFilmById,
    createFilm,
    updateFilm,
    patchFilm,
    deleteFilm
};
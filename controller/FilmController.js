const BaseController = require('./BaseController');

class FilmController extends BaseController {
    constructor() { super('films.json', 'films'); }

    patch = async (req, res) => {
        try {
            const data = await this.manager.readData();
            const items = data.films || [];
            const index = items.findIndex(f => f.id === req.params.id);

            if (index === -1) return res.status(404).json({ error: 'Film not found' });

            const original = items[index];
            const patchData = req.body || {};
            const updatedFields = {};

            Object.keys(patchData).forEach(key => {
                    updatedFields[key] = patchData[key];
            });

            data.films[index] = { ...original, ...updatedFields, id: original.id };
            await this.manager.writeData(data);
            res.json(data.films[index]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new FilmController();
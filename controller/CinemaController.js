const BaseController = require('./BaseController');

class CinemaController extends BaseController {
    constructor() { super('cinemas.json', 'cinemas'); }

    patch = async (req, res) => {
        try {
            const data = await this.manager.readData();
            const items = data.cinemas || [];
            const index = items.findIndex(c => c.id === req.params.id);

            if (index === -1) return res.status(404).json({ error: 'Cinema not found' });

            const original = items[index];
            const patchData = req.body || {};
            const updatedFields = {};

            Object.keys(patchData).forEach(key => {
                    updatedFields[key] = patchData[key];
            });

            data.cinemas[index] = { ...original, ...updatedFields, id: original.id };
            await this.manager.writeData(data);
            res.json(data.cinemas[index]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new CinemaController();
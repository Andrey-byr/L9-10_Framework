const BaseController = require('./BaseController');

class SpectacleController extends BaseController {
    constructor() { super('spectacle.json', 'spectacles'); }

    patch = async (req, res) => {
        try {
            const data = await this.manager.readData();
            const items = data.spectacles || [];
            const index = items.findIndex(s => s.id === req.params.id);

            if (index === -1) return res.status(404).json({ error: 'Spectacle not found' });

            const original = items[index];
            const patchData = req.body || {};
            const updatedFields = {};

            Object.keys(patchData).forEach(key => {
                    updatedFields[key] = patchData[key];
            });

            data.spectacles[index] = { ...original, ...updatedFields, id: original.id };
            await this.manager.writeData(data);
            res.json(data.spectacles[index]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new SpectacleController();
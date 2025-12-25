const BaseController = require('./BaseController');

class StreamerController extends BaseController {
    constructor() { super('streamer.json', 'streamer'); }

    patch = async (req, res) => {
        try {
            const data = await this.manager.readData();
            const items = data.streamer || [];
            const index = items.findIndex(s => s.id === req.params.id);

            if (index === -1) return res.status(404).json({ error: 'Streamer not found' });

            const original = items[index];
            const patchData = req.body || {};
            const updatedFields = {};

            Object.keys(patchData).forEach(key => {
                    updatedFields[key] = patchData[key];
            });

            data.streamer[index] = { ...original, ...updatedFields, id: original.id };
            await this.manager.writeData(data);
            res.json(data.streamer[index]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new StreamerController();
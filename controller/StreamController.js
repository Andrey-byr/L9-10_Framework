const BaseController = require('./BaseController');

class StreamController extends BaseController {
    constructor() { super('stream.json', 'stream'); }

    patch = async (req, res) => {
        try {
            const data = await this.manager.readData();
            const items = data.stream || [];
            const index = items.findIndex(s => s.id === req.params.id);

            if (index === -1) return res.status(404).json({ error: 'Stream not found' });

            const original = items[index];
            const patchData = req.body || {};
            const updatedFields = {};

            Object.keys(patchData).forEach(key => {
                    updatedFields[key] = patchData[key];
            });

            data.stream[index] = { ...original, ...updatedFields, id: original.id };
            await this.manager.writeData(data);
            res.json(data.stream[index]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

module.exports = new StreamController();
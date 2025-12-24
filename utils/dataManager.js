const fs = require('fs').promises;
const path = require('path');

class DataManager {
    constructor(filename) {
        this.filePath = path.join(process.cwd(), 'data', filename);
    }

    async readData() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            const baseStructure = {
                'employees.json': { employees: [] },
                'spectacles.json': { spectacles: [] },
                'films.json': { films: [] },
                'cinemas.json': { cinemas: [] },
                'streamer.json': { streamer: [] },
                'stream.json': { stream: [] }
            };
            
            const key = Object.keys(baseStructure).find(k => this.filePath.includes(k));
            return baseStructure[key] || {};
        }
    }

    async writeData(data) {
        await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    generateId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    _generateUniqueId(existingData = []) {
        let newId;
        const existingIds = new Set(existingData.map(item => item.id));
        do {
            newId = this.generateId();
        } while (existingIds.has(newId));
        return newId;
    }

    generateRandomData(entityType, currentItems = []) {
        const generators = {
            employees: () => ({
                id: this._generateUniqueId(currentItems),
                fullName: `Сотрудник ${Math.floor(Math.random() * 1000)}`,
                age: Math.floor(Math.random() * 50) + 20,
                isFullTime: Math.random() > 0.5,
                departments: this._randomArray(['Режиссура', 'Художественный совет', 'Кастинг', 'Бухгалтерия', 'Технический отдел']),
                hireDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('ru-RU')
            }),
            spectacles: () => ({
                id: this._generateUniqueId(currentItems),
                title: `Спектакль ${Math.floor(Math.random() * 1000)}`,
                year: 1600 + Math.floor(Math.random() * 400),
                isPremiere: Math.random() > 0.5,
                genres: this._randomArray(['Трагедия', 'Драма', 'Комедия', 'Мюзикл', 'Классика']),
                firstPerformanceDate: new Date(Date.now() + Math.random() * 10000000000).toLocaleString('ru-RU')
            }),
            films: () => ({
                id: this._generateUniqueId(currentItems),
                title: `Фильм ${Math.floor(Math.random() * 1000)}`,
                duration: Math.floor(Math.random() * 180) + 60,
                is3D: Math.random() > 0.5,
                genres: this._randomArray(['фантастика', 'приключения', 'драма', 'комедия', 'боевик']),
                releaseDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('ru-RU')
            }),
            cinemas: () => ({
                id: this._generateUniqueId(currentItems),
                name: `Кинотеатр ${Math.floor(Math.random() * 1000)}`,
                totalHalls: Math.floor(Math.random() * 20) + 1,
                hasIMAX: Math.random() > 0.5,
                openingHours: this._generateOpeningHours(),
                openingDate: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString('ru-RU')
            }),
            streamer: () => ({
                id: this._generateUniqueId(currentItems),
                username: `Streamer${Math.floor(Math.random() * 10000)}`,
                category: ['Just Chatting', 'Gaming', 'Music', 'Art', 'IRL'][Math.floor(Math.random() * 5)],
                followers: Math.floor(Math.random() * 1000000),
                isLive: Math.random() > 0.5,
                channelCreated: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
                tags: this._randomArray(['RU', 'EN', 'Gaming', 'Chat', 'Music', 'Art', 'Funny'])
            }),
            stream: () => ({
                id: this._generateUniqueId(currentItems), 
                title: `Stream ${Math.floor(Math.random() * 1000)}`,
                viewers: Math.floor(Math.random() * 10000),
                moderationEnabled: Math.random() > 0.5,
                startedAt: new Date().toISOString(),
                moderators: this._randomArray(['ModAlex', 'ModKate', 'ModJohn', 'ModAnna', 'ModMike'])
            })
        };

        return generators[entityType] ? generators[entityType]() : null;
    }

    _randomArray(options) {
        const count = Math.floor(Math.random() * 3) + 1;
        const shuffled = [...options].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    _generateOpeningHours() {
        const hours = [];
        for (let i = 0; i < 3; i++) {
            const open = 9 + Math.floor(Math.random() * 2);
            const close = 22 + Math.floor(Math.random() * 4);
            hours.push(`${open}:00-${close}:00`);
        }
        return hours;
    }
}

module.exports = DataManager;
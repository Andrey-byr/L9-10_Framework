const http = require('http');
const EventEmitter = require('events'); 
const Router = require('./Router');

class Application extends EventEmitter { 
    constructor() {
        super(); 
        this.router = new Router();
        this.server = null;
    }

    use(middleware) {
        this.router.use(middleware);
    }

    get(path, handler) { this.router.get(path, handler); }
    post(path, handler) { this.router.post(path, handler); }
    put(path, handler) { this.router.put(path, handler); }
    patch(path, handler) { this.router.patch(path, handler); }
    delete(path, handler) { this.router.delete(path, handler); }

    listen(port, callback) {
        this.server = http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            
            if (req.method === 'OPTIONS') {
                res.writeHead(204);
                res.end();
                return;
            }
            
            this.router.handle(req, res);
        });

        this.server.listen(port, () => {
            this.emit('serverStarted', port); 
            if (callback) callback();
        });
    }
}

module.exports = Application;
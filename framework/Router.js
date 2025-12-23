const Request = require('./Request');
const Response = require('./Response');

class Router {
    constructor() {
        this.routes = {
            GET: [],
            POST: [],
            PUT: [],
            PATCH: [],
            DELETE: []
        };
        this.middlewares = [];
    }

    _registerRoute(method, path, handler) {
        const paramRegex = /:(\w+)/g;
        const paramNames = [];
        let regexPath = path;
        
        let match;
        while ((match = paramRegex.exec(path)) !== null) {
            paramNames.push(match[1]);
        }
        
        regexPath = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/:\w+/g, '([^\\/]+)');
        const regex = new RegExp(`^${regexPath}$`);
        
        this.routes[method].push({
            path,
            regex,
            paramNames,
            handler
        });
    }

    get(path, handler) {
        this._registerRoute('GET', path, handler);
    }

    post(path, handler) {
        this._registerRoute('POST', path, handler);
    }

    put(path, handler) {
        this._registerRoute('PUT', path, handler);
    }

    patch(path, handler) {
        this._registerRoute('PATCH', path, handler);
    }

    delete(path, handler) {
        this._registerRoute('DELETE', path, handler);
    }

    use(middleware) {
        this.middlewares.push(middleware);
    }

    _matchRoute(method, pathname) {
        const routes = this.routes[method] || [];
        
        const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
        
        for (const route of routes) {
            const match = normalizedPath.match(route.regex);
            if (match) {
                const params = {};
                route.paramNames.forEach((name, index) => {
                    params[name] = match[index + 1];
                });
                
                return {
                    handler: route.handler,
                    params
                };
            }
        }
        
        return null;
    }

    async handle(req, res) {
        const request = new Request(req);
        const response = new Response(res);
        
        try {
            for (const middleware of this.middlewares) {
                await new Promise((resolve, reject) => {
                    const next = (err) => {
                        if (err) reject(err);
                        else resolve();
                    };
                    middleware(request, response, next);
                });
            }
            
            const routeMatch = this._matchRoute(req.method, request.pathname);
            
            if (routeMatch) {
                request.params = routeMatch.params;
                await routeMatch.handler(request, response);
            } else {
                response.status(404).json({ 
                    error: 'Not Found',
                    message: `Cannot ${req.method} ${request.pathname}`
                });
            }
        } catch (error) {
            console.error('Router error:', error);
            if (!response._headersSent) {
                response.status(500).json({ 
                    error: 'Internal Server Error',
                    message: error.message 
                });
            }
        }
    }
}

module.exports = Router;
const { Transform } = require('stream');

class BodyParser {
    static json() {
        return (req, res, next) => {
            if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
                return next();
            }
            
            let body = '';
            const transformStream = new Transform({
                transform(chunk, encoding, callback) {
                    body += chunk.toString();
                    callback();
                },
                flush(callback) {
                    try {
                        if (body) {
                            req.body = JSON.parse(body);
                        } else {
                            req.body = {};
                        }
                    } catch (error) {
                        req.body = {};
                    }
                    next();
                    callback();
                }
            });
            
            req.pipe(transformStream);
        };
    }
    
    static urlencoded() {
        return (req, res, next) => {
            if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'PATCH') {
                return next();
            }
            
            let body = '';
            const transformStream = new Transform({
                transform(chunk, encoding, callback) {
                    body += chunk.toString();
                    callback();
                },
                flush(callback) {
                    try {
                        req.body = {};
                        const pairs = body.split('&');
                        pairs.forEach(pair => {
                            const [key, value] = pair.split('=');
                            if (key && value) {
                                req.body[decodeURIComponent(key)] = decodeURIComponent(value);
                            }
                        });
                    } catch (error) {
                        req.body = {};
                    }
                    next();
                    callback();
                }
            });
            
            req.pipe(transformStream);
        };
    }
}

module.exports = BodyParser;
function bodyParser(req, res, next) {
    const methodsWithBody = ['POST', 'PUT', 'PATCH'];
    if (methodsWithBody.includes(req.method)) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                if (body.trim()) {
                    req.body = JSON.parse(body);
                } else {
                    req.body = {};
                }
                next();
            } catch (error) {
                console.error('JSON Parse Error:', error);
                req.body = {}; 
                next(); 
            }
        });

        req.on('error', (err) => {
            console.error('Stream Error:', err);
            next(err);
        });
    } else {
        req.body = {};
        next();
    }
}

module.exports = bodyParser;
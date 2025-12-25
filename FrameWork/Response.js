class Response {
    constructor(res) {
        this.res = res;
        this.statusCode = 200;
        this.headers = {};
        this._headersSent = false;
    }

    status(code) {
        if (!this._headersSent) {
            this.statusCode = code;
        }
        return this;
    }

    setHeader(key, value) {
        if (!this._headersSent) {
            this.headers[key] = value;
        }
        return this;
    }

    send(data) {
        if (this._headersSent) {
            console.warn('Headers already sent');
            return;
        }
        
        this._headersSent = true;
        
        let contentType = 'text/plain';
        if (typeof data === 'object' && data !== null) {
            contentType = 'application/json';
            data = JSON.stringify(data, null, 2);
        } else if (typeof data !== 'string') {
            data = String(data);
        }
        
        this.headers['Content-Type'] = contentType;
        
        this.res.writeHead(this.statusCode, this.headers);
        this.res.end(data);
    }

    json(data) {
        this.setHeader('Content-Type', 'application/json');
        this.send(data);
    }

    end() {
        if (!this._headersSent) {
            this.res.writeHead(this.statusCode, this.headers);
            this._headersSent = true;
        }
        this.res.end();
    }
}

module.exports = Response;
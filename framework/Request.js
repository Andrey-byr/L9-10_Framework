class Request {
    constructor(req) {
        this.req = req;
        this.url = req.url;
        this.method = req.method;
        this.headers = req.headers;
        this._body = null;
        this._params = {};
        this._query = {};
        this._parseUrl();
    }

    _parseUrl() {
        const url = this.url;
        const [path, queryString] = url.split('?');
        
        this.pathname = path || '/';
        this._query = {};
        
        if (queryString) {
            queryString.split('&').forEach(pair => {
                const [key, value] = pair.split('=');
                if (key) {
                    this._query[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
                }
            });
        }
    }

    set params(params) {
        this._params = params;
    }

    get params() {
        return this._params;
    }

    get query() {
        return this._query;
    }

    get body() {
        return this._body;
    }

    set body(bodyData) {
        this._body = bodyData;
    }
}

module.exports = Request;
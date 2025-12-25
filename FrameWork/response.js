class Response {
  constructor(res) {
    this.res = res;
  }

  setHeader(name, value) {
    this.res.setHeader(name, value);
  }

  status(code) {
    this.res.statusCode = code;
    return this;
  }

  send(data, contentType = 'text/plain; charset=utf-8') {
    this.res.setHeader('Content-Type', contentType);
    this.res.end(data);
  }

  json(obj) {
    this.send(JSON.stringify(obj), 'application/json');
  }
}

module.exports = Response;
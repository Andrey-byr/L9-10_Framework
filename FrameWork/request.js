const url = require('url');

class Request {
  constructor(req) {
    this.req = req;
    this.method = req.method;
    this.url = req.url;
    this.headers = req.headers;
    this.parsedUrl = url.parse(req.url, true);
    this.pathname = this.parsedUrl.pathname;
    this.query = this.parsedUrl.query;
  }

  async body() {
    return new Promise((resolve, reject) => {
      let data = '';
      this.req.on('data', chunk => data += chunk);
      this.req.on('end', () => resolve(data));
      this.req.on('error', reject);
    });
  }
}

module.exports = Request;
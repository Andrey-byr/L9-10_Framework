const http = require('http');
const Request = require('./request');
const Response = require('./response');
const ErrorHandler = require('./errorHandler');

class App {
  constructor() {
    this.middlewares = [];
    this.routes = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  addRoute(method, path, handler) {
    this.routes.push({ method, path, handler });
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      const request = new Request(req);
      const response = new Response(res);

      let i = 0;
      const next = () => {
        if (i < this.middlewares.length) {
          const mw = this.middlewares[i++];
          try {
            mw(request, response, next);
          } catch (err) {
            ErrorHandler.handle(err, request, response);
          }
        } else {
          this.handleRoute(request, response);
        }
      };

      try {
        next();
      } catch (err) {
        ErrorHandler.handle(err, request, response);
      }
    });

    server.listen(port, callback);
  }

  handleRoute(request, response) {
    const route = this.routes.find(
      r => r.method === request.method && r.path === request.pathname
    );

    if (route) {
      try {
        route.handler(request, response);
      } catch (err) {
        ErrorHandler.handle(err, request, response);
      }
    } else {
      response.status(404).json({ error: 'Маршрут не найден' });
    }
  }
}

module.exports = App;
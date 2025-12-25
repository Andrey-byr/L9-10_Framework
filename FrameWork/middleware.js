function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

function jsonParser(req, res, next) {
  if (req.headers['content-type'] === 'application/json') {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        req.body = JSON.parse(data);
      } catch {
        req.body = null;
      }
      next();
    });
  } else {
    next();
  }
}

function notFound(req, res) {
  res.status(404).json({ error: "Маршрут не найден" });
}

module.exports = { logger, jsonParser, notFound };
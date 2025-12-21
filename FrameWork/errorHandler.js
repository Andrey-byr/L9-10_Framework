class ErrorHandler {
  static handle(err, req, res) {
    console.error('Ошибка:', err.message);

    if (res && typeof res.status === 'function') {
      res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Внутренняя ошибка сервера' }));
    }
  }
}

module.exports = ErrorHandler;
const App = require('./app');
const { logger, jsonParser } = require('./middleware');

const app = new App();

app.use(logger);
app.use(jsonParser);

app.addRoute('GET', '/data', (req, res) => {
  res.json({ method: 'GET', message: 'Запрос выполнен' });
});

app.addRoute('POST', '/data', async (req, res) => {
  res.json({ method: 'POST', body: req.body });
});

app.addRoute('PUT', '/data', (req, res) => {
  res.json({ method: 'PUT', message: 'Запрос выполнен' });
});

app.addRoute('PATCH', '/data', (req, res) => {
  res.json({ method: 'PATCH', message: 'Запрос выполнен' });
});

app.addRoute('DELETE', '/data', (req, res) => {
  res.json({ method: 'DELETE', message: 'Запрос выполнен' });
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
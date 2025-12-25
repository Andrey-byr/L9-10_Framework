const Application = require('./framework/Application');
const bodyParser = require('./framework/middleware/bodyParser');
const apiRouter=require('./routes/apiRoutes');

const app = new Application();

app.use(bodyParser); 
app.use(apiRouter);   

app.get('/', (req, res) => {
    res.json({ status: "All systems nominal" });
});

app.listen(process.env.PORT||3000, () => console.log('Server started on port 3000'));
const Application = require('./framework/Application');
const bodyParser = require('./framework/middleware/bodyParser');
const {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    patchEmployee,
    deleteEmployee
} = require('./controller/employees');

const {
    getSpectacles,
    getSpectacleById,
    createSpectacle,
    updateSpectacle,
    patchSpectacle,
    deleteSpectacle
} = require('./controller/spectacles');

const {
    getFilms,
    getFilmById,
    createFilm,
    updateFilm,
    patchFilm,
    deleteFilm
} = require('./controller/films');

const {
    getCinemas,
    getCinemaById,
    createCinema,
    updateCinema,
    patchCinema,
    deleteCinema
} = require('./controller/cinemas');

const {
    getStreamers,
    getStreamerById,
    createStreamer,
    updateStreamer,
    patchStreamer,
    deleteStreamer
} = require('./controller/streamers');

const {
    getStreams,
    getStreamById,
    createStream,
    updateStream,
    patchStream,
    deleteStream
} = require('./controller/streams');

const app = new Application();

app.use(bodyParser);

app.get('/employees', getEmployees);
app.get('/employees/:id', getEmployeeById);
app.post('/employees', createEmployee);
app.put('/employees/:id', updateEmployee);
app.patch('/employees/:id', patchEmployee);
app.delete('/employees/:id', deleteEmployee);

app.get('/spectacles', getSpectacles);
app.get('/spectacles/:id', getSpectacleById);
app.post('/spectacles', createSpectacle);
app.put('/spectacles/:id', updateSpectacle);
app.patch('/spectacles/:id', patchSpectacle);
app.delete('/spectacles/:id', deleteSpectacle);

app.get('/films', getFilms);
app.get('/films/:id', getFilmById);
app.post('/films', createFilm);
app.put('/films/:id', updateFilm);
app.patch('/films/:id', patchFilm);
app.delete('/films/:id', deleteFilm);

app.get('/cinemas', getCinemas);
app.get('/cinemas/:id', getCinemaById);
app.post('/cinemas', createCinema);
app.put('/cinemas/:id', updateCinema);
app.patch('/cinemas/:id', patchCinema);
app.delete('/cinemas/:id', deleteCinema);

app.get('/streamers', getStreamers);
app.get('/streamers/:id', getStreamerById);
app.post('/streamers', createStreamer);
app.put('/streamers/:id', updateStreamer);
app.patch('/streamers/:id', patchStreamer);
app.delete('/streamers/:id', deleteStreamer);

app.get('/streams', getStreams);
app.get('/streams/:id', getStreamById);
app.post('/streams', createStream);
app.put('/streams/:id', updateStream);
app.patch('/streams/:id', patchStream);
app.delete('/streams/:id', deleteStream);

app.get('/', (req, res) => {
    res.json({
        message: "Welcome to the Framework API!",
        availableEndpoints: [
            "/employees",
            "/spectacles",
            "/films",
            "/cinemas",
            "/streamers",
            "/streams"
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
   
});
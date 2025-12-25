const Router = require('../framework/Router');
const employeeCtrl = require('../controller/EmployeeController');
const cinemaCtrl = require('../controller/CinemaController');
const filmCtrl = require('../controller/FilmController');
const spectacleCtrl = require('../controller/SpectacleController');
const streamerCtrl = require('../controller/StreamerController');
const streamCtrl = require('../controller/StreamController');

const api = new Router();

function addResource(path, ctrl) {
    api.get(path, ctrl.getAll);
    api.get(`${path}/:id`, ctrl.getById);
    api.post(path, ctrl.create);
    api.put(`${path}/:id`, ctrl.update);
    api.patch(`${path}/:id`, ctrl.patch);
    api.delete(`${path}/:id`, ctrl.delete);
}

addResource('/employees', employeeCtrl);
addResource('/cinemas', cinemaCtrl);
addResource('/films', filmCtrl);
addResource('/spectacles', spectacleCtrl);
addResource('/streamers', streamerCtrl);
addResource('/streams', streamCtrl);

module.exports = (request, response, next) => {
    api.handle(request.req, response.res, request);
};
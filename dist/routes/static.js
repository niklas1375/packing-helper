"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const modules_1 = require("../modules");
const register = (app) => {
    app.get('/accomodation', modules_1.staticContent.getAccomodationTypes);
    app.get('/activities', modules_1.staticContent.getActivityTypes);
    app.get('/transport', modules_1.staticContent.getTransportTypes);
    app.get('/triptypes', modules_1.staticContent.getTripTypes);
    app.get('/weather', modules_1.staticContent.getWeatherTypes);
};
exports.register = register;
//# sourceMappingURL=static.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherTypes = exports.getTripTypes = exports.getTransportTypes = exports.getActivityTypes = exports.getAccomodationTypes = void 0;
const accomodation_json_1 = __importDefault(require("../content/accomodation.json"));
const activities_json_1 = __importDefault(require("../content/activities.json"));
const transport_json_1 = __importDefault(require("../content/transport.json"));
const tripType_json_1 = __importDefault(require("../content/tripType.json"));
const weather_json_1 = __importDefault(require("../content/weather.json"));
function getAccomodationTypes(_, res) {
    res.json(_getTypesFromJSON(accomodation_json_1.default));
}
exports.getAccomodationTypes = getAccomodationTypes;
function getActivityTypes(_, res) {
    res.json(_getTypesFromJSON(activities_json_1.default));
}
exports.getActivityTypes = getActivityTypes;
function getTransportTypes(_, res) {
    res.json(_getTypesFromJSON(transport_json_1.default));
}
exports.getTransportTypes = getTransportTypes;
function getTripTypes(_, res) {
    res.json(_getTypesFromJSON(tripType_json_1.default));
}
exports.getTripTypes = getTripTypes;
function getWeatherTypes(_, res) {
    res.json(_getTypesFromJSON(weather_json_1.default));
}
exports.getWeatherTypes = getWeatherTypes;
function _getTypesFromJSON(typesJSON) {
    return typesJSON.map(typeJSON => {
        return {
            "key": typeJSON.key,
            "name": typeJSON.name
        };
    });
}

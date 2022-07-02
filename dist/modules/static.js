"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeatherTypes = exports.getTripTypes = exports.getTransportTypes = exports.getActivityTypes = exports.getAccomodationTypes = void 0;
const index_json_1 = __importDefault(require("../content/accomodation/index.json"));
const index_json_2 = __importDefault(require("../content/activities/index.json"));
const index_json_3 = __importDefault(require("../content/transport/index.json"));
const index_json_4 = __importDefault(require("../content/types/index.json"));
const index_json_5 = __importDefault(require("../content/weather/index.json"));
function getAccomodationTypes(_, res) {
    res.json(_getTypesFromJSON(index_json_1.default));
}
exports.getAccomodationTypes = getAccomodationTypes;
function getActivityTypes(_, res) {
    res.json(_getTypesFromJSON(index_json_2.default));
}
exports.getActivityTypes = getActivityTypes;
function getTransportTypes(_, res) {
    res.json(_getTypesFromJSON(index_json_3.default));
}
exports.getTransportTypes = getTransportTypes;
function getTripTypes(_, res) {
    res.json(_getTypesFromJSON(index_json_4.default));
}
exports.getTripTypes = getTripTypes;
function getWeatherTypes(_, res) {
    res.json(_getTypesFromJSON(index_json_5.default));
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

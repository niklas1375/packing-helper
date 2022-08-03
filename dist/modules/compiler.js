"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileListFromSelections = void 0;
const accomodation_json_1 = __importDefault(require("../content/accomodation.json"));
const activities_json_1 = __importDefault(require("../content/activities.json"));
const transport_json_1 = __importDefault(require("../content/transport.json"));
const tripType_json_1 = __importDefault(require("../content/tripType.json"));
const weather_json_1 = __importDefault(require("../content/weather.json"));
const basics_json_1 = __importDefault(require("../content/basics.json"));
const packingList_1 = require("../types/packingList");
function compileListFromSelections(req, res) {
    const packingList = new packingList_1.PackingList();
    Object.assign(packingList, basics_json_1.default);
    const accomodationsList = accomodation_json_1.default;
    const activitiesList = activities_json_1.default;
    const transportList = transport_json_1.default;
    const triptypesList = tripType_json_1.default;
    const weatherList = weather_json_1.default;
    const choices = req.body;
    const accChoice = accomodationsList.find((entry) => entry.key === choices.accomodation);
    const actChoices = activitiesList.filter((entry) => choices.activities.includes(entry.key));
    const transportChoice = transportList.find((entry) => entry.key === choices.transport);
    const tripChoice = triptypesList.find((entry) => entry.key === choices.triptype);
    const weatherSelection = weatherList.filter((entry) => choices.weather.includes(entry.key));
    [accChoice, transportChoice, tripChoice].forEach((choice) => {
        if (!!choice)
            return;
        packingList.addPackingList(choice.content);
    });
    [actChoices, weatherSelection].forEach((list) => list.forEach((choice) => {
        packingList.addPackingList(choice.content);
    }));
    packingList.removeDuplicates();
    res.json(packingList);
}
exports.compileListFromSelections = compileListFromSelections;
//# sourceMappingURL=compiler.js.map
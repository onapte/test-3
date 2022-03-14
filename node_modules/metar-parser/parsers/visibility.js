const Parser = require("../parser");
const { UNITS } = require("../texts");

module.exports = class VisibilityParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([0-9]{4})\s|\s((?:[0-9]{1,2}\/)?[0-9]{1,2})(SM|KM)\s/);

        if (!match) {
            return {
                visibility: null
            };
        }

        const unit = UNITS[match[3]] || "meter";
        let distance;

        if (match[2] && match[2].includes("/")) {
            const parts = match[2].split("/").map(part => parseInt(part, 10));

            distance = parts[0] / parts[1];
        } else {
            distance = parseInt(match[1] || match[2], 10);
        }

        let distanceMeters;
        let distanceFeet;

        if (unit === "meter") {
            distanceMeters = distance;
            distanceFeet = Math.round(distance * 3.2808);
        } else if (unit === "kilometer") {
            distanceMeters = distance * 1000;
            distanceFeet = Math.round(distanceMeters * 3.2808);
        } else if (unit === "statute mile") {
            distanceFeet = distance * 5280;
            distanceMeters = Math.round(distanceFeet * 0.3048);
        }

        return {
            visibility: {
                meters: distanceMeters,
                feet: distanceFeet,
                miles: Math.round(distanceFeet / 5280 * 100) / 100,
                kilometers: Math.round(distanceMeters / 10) / 100
            }
        };
    }
};

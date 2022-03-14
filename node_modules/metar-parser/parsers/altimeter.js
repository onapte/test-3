const Parser = require("../parser");

module.exports = class AltimeterParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s(Q|A)([0-9]{4})\s/);

        if (!match) {
            return {
                altimeter: null
            };
        }

        const type = match[1];
        const value = parseInt(match[2], 10);

        let inchesHg;
        let millibars;

        if (type === "A") {
            inchesHg = value / 100;
            millibars = Math.round(value / 100 * 33.8637526);
        } else if (type === "Q") {
            millibars = value;
            inchesHg = Math.round(value * 100 * 0.0295301) / 100;
        }

        return {
            altimeter: {
                inches: inchesHg,
                millibars
            }
        };
    }
};

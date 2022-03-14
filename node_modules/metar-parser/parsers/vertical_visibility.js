const Parser = require("../parser");

module.exports = class VerticalVisibilityParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sVV([0-9]{3})|(\/\/\/)\s/);

        if (!match) {
            return {
                verticalVisibility: null
            };
        }

        const units = match[1] ? parseInt(match[1], 10) : 0;
        const meters = units * 30;
        const feet = units * 100;

        return {
            verticalVisibility: {
                meters,
                feet
            }
        };
    }
};

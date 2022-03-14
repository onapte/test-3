const Parser = require("../parser");

module.exports = class VariationParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([0-9]{3})V([0-9]{3})\s/);

        if (!match) {
            return {
                wind: {
                    variation: null
                }
            };
        }

        return {
            wind: {
                variation: {
                    min: parseInt(match[1], 10),
                    max: parseInt(match[2], 10)
                }
            }
        };
    }
};

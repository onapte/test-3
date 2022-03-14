const Parser = require("../parser");

module.exports = class TypeParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s(METAR|SPECI)\s/);

        return {
            type: match ? match[1] : "METAR"
        };
    }
};

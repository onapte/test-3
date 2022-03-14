const Parser = require("../parser");

module.exports = class NosigParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sNOSIG\s/);

        return {
            nosig: !!match
        };
    }
};

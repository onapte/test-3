const Parser = require("../parser");

module.exports = class AutoParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sAUTO\s/);

        return {
            auto: !!match
        };
    }
};

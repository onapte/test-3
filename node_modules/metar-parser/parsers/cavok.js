const Parser = require("../parser");

module.exports = class CavokParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sCAVOK\s/);

        return {
            cavok: !!match
        };
    }
};

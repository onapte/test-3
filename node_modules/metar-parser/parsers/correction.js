const Parser = require("../parser");

module.exports = class CorrectionParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sCOR|CC([A-Z])\s/);

        return {
            correction: match ? match[1] : false
        };
    }
};

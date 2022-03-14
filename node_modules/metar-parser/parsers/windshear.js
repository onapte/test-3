const Parser = require("../parser");

module.exports = class WindshearParser extends Parser {
    static parse(metar) {
        let part;
        const match = [];
        const regex = /WS\s(?:RWY([0-9]{2}[LRC]?))|(ALL RWY)/g;

        while (part = regex.exec(metar)) {
            match.push(part);
        }

        return {
            windshear: match.map(group => group[1] || group[2])
        };
    }
};

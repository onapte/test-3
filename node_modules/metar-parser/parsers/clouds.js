const Parser = require("../parser");
const { SKY_CONDITIONS } = require("../texts");

module.exports = class CloudsParser extends Parser {
    static parse(metar) {
        let part;
        const match = [];
        const regex = /(CLR|SKC|FEW|SCT|BKN|OVC|VV)([0-9/]{3})(CU|CB|TCU|CI|[/]{3})?/g;

        while (part = regex.exec(metar)) {
            match.push(part);
        }

        return {
            clouds: match.map(group => {
                return {
                    code: group[1],
                    meaning: SKY_CONDITIONS[group[1]],
                    altitude: parseInt(group[2], 10) * 100,
                    type: group[3] || null,
                    typeMeaning: group[3] ? SKY_CONDITIONS[group[3]] : null
                };
            })
        };
    }
};

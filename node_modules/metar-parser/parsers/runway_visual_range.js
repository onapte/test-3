const Parser = require("../parser");
const { RWR_TREND } = require("../texts");

module.exports = class RVRParser extends Parser {

    /**
     * Parses Runway Visual Range
     * @param {string} metar Metar string
     * @returns {Object} Parsed object
     */
    static parse(metar) {
        let part;
        const match = [];
        const regex = /R([0-9]{2}[LRC]?)\/([MP])?([0-9]{4})(?:V([MP])?([0-9]{4}))?(FT)?\/?([UND]?)/g;

        while (part = regex.exec(metar)) {
            match.push(part);
        }

        return {
            runwayVisualRange: match.map(group => {
                const min = parseInt(group[3], 10);
                const minRange = RWR_TREND[group[2]] || "exact";

                return {
                    runway: group[1],
                    min,
                    minRange,
                    max: group[5] ? parseInt(group[5], 10) : min,
                    maxRange: group[5] ? RWR_TREND[group[4]] || "exact" : "exact",
                    trend: RWR_TREND[group[7]] || "not possible to determine"
                };
            })
        };
    }
};

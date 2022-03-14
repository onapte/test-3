const Parser = require("../parser");

module.exports = class StationParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([A-Z]{4})\s/);

        return {
            station: match ? match[1] : "unknown"
        };
    }

    static toText(output) {
        return `Report location: ${output.station}`;
    }
};

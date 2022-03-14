const Parser = require("../parser");
const { convertKTtoMPS, convertMPStoKT } = require("../utils");

module.exports = class WindParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([0-9]{3}|VRB)([0-9]{2})(?:G([0-9]{2}))?(KT|MPS)\s/);

        if (!match) {
            return {
                wind: null
            };
        }

        const speed = parseInt(match[2], 10);
        let speedKt;
        let speedMps;

        if (match[4] === "KT") {
            speedKt = speed;
            speedMps = convertKTtoMPS(speed);
        } else {
            speedMps = speed;
            speedKt = convertMPStoKT(speed);
        }

        return {
            wind: {
                direction: match[1] === "VRB" ? "VRB" : parseInt(match[1], 10),
                speedKt,
                speedMps,
                gust: match[3] ? parseInt(match[3], 10) : false,
                variableDirection: match[1] === "VRB"
            }
        };
    }
};

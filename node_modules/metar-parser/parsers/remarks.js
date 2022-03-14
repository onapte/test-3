const Parser = require("../parser");
const { convertKTtoMPS } = require("../utils");

module.exports = class RemarksParser extends Parser {
    static parse(metar) {
        let match = metar.match(/RMK\s(.+)$/);

        if (!match) {
            return {
                remarks: null
            };
        }

        const remarkStr = match[1];
        const remarks = {};

        // STATION TYPE
        if (remarkStr.includes("AO1")) {
            remarks.stationType = {
                description: "Type of automated station",
                remark: "AO1",
                value: "Station is not equipped with a rain/snow sensor"
            };
        } else if (remarkStr.includes("AO2")) {
            remarks.stationType = {
                description: "Type of automated station",
                remark: "AO2",
                value: "Station is equipped with a rain/snow sensor"
            };
        }

        // PEAK WIND
        if (match = remarkStr.match(/PK\sWND\s([0-9]{3})([0-9]{2})\/([0-9]{2})([0-9]{2})/)) {
            const date = new Date();

            date.setUTCHours(match[3]);
            date.setUTCMinutes(match[4]);

            remarks.peakWind = {
                description: "Peak wind",
                remark: match[0],
                value: {
                    direction: match[1],
                    speedKT: match[2],
                    speedMPS: convertKTtoMPS(match[2]),
                    date: date.toUTCString()
                }
            };
        }

        return {
            remarks
        };
    }
};

const Parser = require("../parser");
const { WEATHER } = require("../texts");

module.exports = class WeatherParser extends Parser {
    static parse(metar) {
        const regex = /(-|\+|VC)?(MI|PR|BC|DR|BL|SH|TS|FZ)?(DZ|RA|SN|SG|IC|PE|GR|GS|UP)?(BR|FG|FU|VA|DU|SA|HZ|PY)?(PO|SQ|FC|SS)?/;
        const data = metar.split(" ")
            .filter(str => !!str)
            .map(word => word.match(regex))
            .filter(match => match !== null && match[0] !== "")
            .map(group => {
                return {
                    codes: [group[2], group[3], group[4]].filter(code => !!code),
                    intensity: group[1] ? WEATHER[group[1]] : "moderate",
                    descriptor: WEATHER[group[2]] || null,
                    precipitation: WEATHER[group[3]] || null,
                    obscuration: WEATHER[group[4]] || null
                };
            });

        return {
            weather: data
        };
    }
};

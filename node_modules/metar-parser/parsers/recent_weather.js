const Parser = require("../parser");
const { WEATHER } = require("../texts");

module.exports = class RecentWeatherParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\sRE((?:[A-Z]{2})+)\s/);

        if (!match) {
            return {
                recentWeather: []
            };
        }

        return {
            recentWeather: match[1].match(/.{1,2}/g).map(group => {
                return {
                    code: group,
                    meaning: WEATHER[group] || null
                };
            })
        };
    }
};

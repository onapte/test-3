const Parser = require("../parser");

module.exports = class TimeParser extends Parser {
    static parse(metar) {
        const match = ` ${metar} `.match(/\s([0-9]{2})([0-9]{2})([0-9]{2})Z\s/);

        if (!match) {
            return {
                time: null
            };
        }

        const day = parseInt(match[1], 10);
        const hour = parseInt(match[2], 10);
        const minute = parseInt(match[3], 10);

        const date = new Date();

        date.setUTCDate(day);
        date.setUTCHours(hour);
        date.setUTCMinutes(minute);

        return {
            time: {
                day,
                hour,
                minute,
                date: date.toUTCString()
            }
        };
    }
};

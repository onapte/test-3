/**
 * Simple object check.
 * @param {any} item Subject
 * @returns {boolean} isObject
 */
function isObject(item) {
    return (item && typeof item === "object" && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param {Object} target Object to merge in
 * @param {Object} sources Objects to merge
 * @returns {Object} Merged object
 */
function mergeDeep(target, ...sources) {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
}

/**
 * Parses METAR/SPECI format
 * @param {string} metar Metar report string
 * @returns {Object} Parsed Metar object
 */
module.exports = function parse(metar) {
    let result = {};

    [
        require("./parsers/type"),
        require("./parsers/auto"),
        require("./parsers/station"),
        require("./parsers/time"),
        require("./parsers/wind"),
        require("./parsers/correction"),
        require("./parsers/nosig"),
        require("./parsers/wind_variation"),
        require("./parsers/visibility"),
        require("./parsers/tempdew"),
        require("./parsers/altimeter"),
        require("./parsers/clouds"),
        require("./parsers/runway_visual_range"),
        require("./parsers/weather"),
        require("./parsers/cavok"),
        require("./parsers/windshear"),
        require("./parsers/vertical_visibility"),
        require("./parsers/recent_weather"),
        require("./parsers/remarks")
    ]
        .map(parser => parser.parse(metar.toUpperCase()))
        .forEach(data => {
            result = mergeDeep(result, data);
        });

    return result;
};

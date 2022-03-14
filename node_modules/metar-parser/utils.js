module.exports.convertKTtoMPS = kt => {
    return Math.round(parseFloat(kt) / 1.94384 * 100) / 100;
};

module.exports.convertMPStoKT = mps => {
    return Math.round(parseFloat(mps) * 1.94384 * 100) / 100;
};

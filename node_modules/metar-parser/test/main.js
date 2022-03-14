const assert = require("assert");
const parse = require("../index");

describe("metar-parser", () => {
    it("parses type", () => {
        let result;

        result = parse("METAR CYYZ 040600Z");
        assert.strictEqual(result.type, "METAR");

        result = parse("SPECI CYQB 191211Z");
        assert.strictEqual(result.type, "SPECI");

        result = parse("EVRA 601050Z 20014KT CAVOK");
        assert.strictEqual(result.type, "METAR");
    });

    it("parses station", () => {
        let result;

        result = parse("METAR CYWG 172000Z 30015G25KT 3/4SM R36/4000FT/D -SN BLSN BKN008");
        assert.strictEqual(result.station, "CYWG");

        result = parse("SPECI CYQB 191211Z");
        assert.strictEqual(result.station, "CYQB");

        result = parse("EVRA 601050Z 20014KT CAVOK");
        assert.strictEqual(result.station, "EVRA");
    });

    it("parses auto and nosig and correction", () => {
        let result;

        result = parse("EGLL 301750Z AUTO 27010KT 9999 OVC037 08/04 Q1000 NOSIG");

        assert.strictEqual(result.auto, true);
        assert.strictEqual(result.nosig, true);
        assert.strictEqual(result.correction, false);

        result = parse("METAR CYWG 172000Z 30015G25KT 3/4SM R36/4000FT/D -SN BLSN BKN008");

        assert.strictEqual(result.auto, false);
        assert.strictEqual(result.nosig, false);
        assert.strictEqual(result.correction, false);

        result = parse("METAR CYWG 172000Z CCB 30015G25KT 3/4SM R36/4000FT/D -SN BLSN BKN008");

        assert.strictEqual(result.correction, "B");
    });

    it("parses cavok", () => {
        let result;

        result = parse("HECA 301800Z 03008KT CAVOK 24/13 Q1018 NOSIG");

        assert.strictEqual(result.cavok, true);

        result = parse("EVRA 301820Z 14013KT 100V160 9999 OVC009 07/06 Q1015 R18/190095 NOSIG");

        assert.strictEqual(result.cavok, false);
    });

    it("parses temperature and dewpoint", () => {
        let result;

        result = parse("EYSA 301820Z 13018KT 9000 -DZ OVC007 10/09 Q1013 GRN NOSIG");

        assert.strictEqual(result.temperature.celsius, 10);
        assert.strictEqual(result.dewpoint.celsius, 9);
        assert.strictEqual(result.temperature.fahrenheit, 50);
        assert.strictEqual(result.dewpoint.fahrenheit, 48.2);

        result = parse("UUEE 301800Z 11006MPS CAVOK M02/M06 Q1038 R06C/290045 R06R/290045 NOSIG");

        assert.strictEqual(result.temperature.celsius, -2);
        assert.strictEqual(result.dewpoint.celsius, -6);
        assert.strictEqual(result.temperature.fahrenheit, 28.4);
        assert.strictEqual(result.dewpoint.fahrenheit, 21.2);
    });

    it("parses altimeter", () => {
        let result;

        result = parse("EVRA 301820Z 14013KT 100V160 9999 OVC009 07/06 Q1015 R18/190095 NOSIG");

        assert.strictEqual(result.altimeter.millibars, 1015);
        assert.strictEqual(result.altimeter.inches, 29.97);

        result = parse("KDFW 301753Z 19020G25KT 10SM BKN032 BKN250 26/18 A2986 RMK AO2 PK WND 20027/1718 SLP104 T02560183 10261 20206 58010");

        assert.strictEqual(result.altimeter.millibars, 1011);
        assert.strictEqual(result.altimeter.inches, 29.86);
    });

    it("parses clouds", () => {
        let result;

        result = parse("EVRA 301820Z 14013KT 100V160 9999 OVC009 07/06 Q1015 R18/190095 NOSIG");

        assert.strictEqual(result.clouds[0].code, "OVC");
        assert.strictEqual(result.clouds[0].meaning, "overcast");
        assert.strictEqual(result.clouds[0].altitude, 900);
        assert.strictEqual(result.clouds[0].type, null);
        assert.strictEqual(result.clouds[0].typeMeaning, null);

        result = parse("EGCC 301820Z AUTO 24008KT 9999 SCT025TCU 05/03 Q0998 NOSIG");

        assert.strictEqual(result.clouds[0].code, "SCT");
        assert.strictEqual(result.clouds[0].meaning, "scattered");
        assert.strictEqual(result.clouds[0].altitude, 2500);
        assert.strictEqual(result.clouds[0].type, "TCU");
        assert.strictEqual(result.clouds[0].typeMeaning, "towering cumulus");
    });

    it("parses weather", () => {
        const result = parse("METAR CYWG 172000Z 30015G25KT 3/4SM R36/4000FT/D -SN BLSN BKN008 OVC040 M05/M08 A2992 REFZRA WS RWY36");

        assert.deepStrictEqual(result.weather[0].codes, ["SN"]);
        assert.strictEqual(result.weather[0].intensity, "light");
        assert.strictEqual(result.weather[0].descriptor, null);
        assert.strictEqual(result.weather[0].precipitation, "snow");
        assert.strictEqual(result.weather[0].obscuration, null);

        assert.deepStrictEqual(result.weather[1].codes, ["BL", "SN"]);
        assert.strictEqual(result.weather[1].intensity, "moderate");
        assert.strictEqual(result.weather[1].descriptor, "blowing");
        assert.strictEqual(result.weather[1].precipitation, "snow");
        assert.strictEqual(result.weather[1].obscuration, null);
    });

    it("parses recent weather", () => {
        const result = parse("METAR CYWG 172000Z 30015G25KT 3/4SM R36/4000FT/D -SN BLSN BKN008 OVC040 M05/M08 A2992 REFZRA WS RWY36");

        assert.strictEqual(result.recentWeather.map(code => code.meaning).join(" "), "freezing rain");
    });

    it("parses windshear", () => {
        const result = parse("METAR CYWG 172000Z 30015G25KT 3/4SM R36/4000FT/D -SN BLSN BKN008 OVC040 M05/M08 A2992 REFZRA WS RWY36");

        assert.strictEqual(result.windshear.includes("36"), true);
        assert.strictEqual(result.windshear.includes("18"), false);
    });

    it("parses vertical visibility", () => {
        const result = parse("METAR CYYT 081100Z 00000KT 0SM FG VV1300 07/07 A3019 RMK F8 SLP224");

        assert.strictEqual(result.verticalVisibility.meters, 3900);
        assert.strictEqual(result.verticalVisibility.feet, 13000);
    });

    it("parses datetime", () => {
        const result = parse("METAR CYWG 172000Z 30015G25KT 3/4SM R36/4000FT/D -SN BLSN BKN008");

        const date = new Date();

        date.setUTCDate(result.time.day);
        date.setUTCHours(result.time.hour);
        date.setUTCMinutes(result.time.minute);

        assert.strictEqual(result.time.day, 17);
        assert.strictEqual(result.time.hour, 20);
        assert.strictEqual(result.time.minute, 0);
        assert.strictEqual(result.time.date, date.toUTCString());
    });

    it("parses wind", () => {
        let result;

        result = parse("METAR CYWG 172000Z 30015G25KT 3/4SM R36/4000FT/D -SN BLSN BKN008");

        assert.strictEqual(result.wind.direction, 300);
        assert.strictEqual(result.wind.speedKt, 15);
        assert.strictEqual(result.wind.gust, 25);
        assert.strictEqual(result.wind.variableDirection, false);

        result = parse("METAR CYWG 172000Z 22010KT 3/4SM R36/4000FT/D -SN BLSN BKN008");

        assert.strictEqual(result.wind.direction, 220);
        assert.strictEqual(result.wind.speedKt, 10);
        assert.strictEqual(result.wind.gust, false);
        assert.strictEqual(result.wind.variableDirection, false);

        result = parse("METAR CYWG 172000Z VRB02KT 3/4SM R36/4000FT/D -SN BLSN BKN008");

        assert.strictEqual(result.wind.direction, "VRB");
        assert.strictEqual(result.wind.speedKt, 2);
        assert.strictEqual(result.wind.gust, false);
        assert.strictEqual(result.wind.variableDirection, true);
    });

    it("parses wind direction variations", () => {
        const result = parse("METAR CYWG 172000Z 30015G25KT 260V340 3/4SM R36/4000FT/D");

        assert.strictEqual(result.wind.variation.min, 260);
        assert.strictEqual(result.wind.variation.max, 340);
    });

    it("parses prevailing visibility", () => {
        let result;

        result = parse("METAR CYWG 172000Z 30015G25KT 260V340 3/4SM R36/4000FT/D");

        assert.strictEqual(result.visibility.miles, 0.75);
        assert.strictEqual(result.visibility.kilometers, 1.21);

        result = parse("METAR LBBG 041600Z 12012MPS 090V150 1400 R04/P1500N R22/P1500U");

        assert.strictEqual(result.visibility.miles, 0.87);
        assert.strictEqual(result.visibility.kilometers, 1.4);

        result = parse("METAR LBBG 041600Z 12012MPS 090V150 1KM R04/P1500N R22/P1500U");

        assert.strictEqual(result.visibility.miles, 0.62);
        assert.strictEqual(result.visibility.kilometers, 1);
    });

    it("parses runway visual range", () => {
        let result;

        result = parse("METAR CYWG 172000Z 30015G25KT 260V340 3/4SM R36R/4000FT/D");

        assert.strictEqual(result.runwayVisualRange[0].runway, "36R");
        assert.strictEqual(result.runwayVisualRange[0].trend, "downward");
        assert.strictEqual(result.runwayVisualRange[0].min, 4000);
        assert.strictEqual(result.runwayVisualRange[0].minRange, "exact");
        assert.strictEqual(result.runwayVisualRange[0].max, 4000);
        assert.strictEqual(result.runwayVisualRange[0].maxRange, "exact");

        result = parse("METAR CYWG 172000Z 30015G25KT 260V340 3/4SM R27/P6000FT/N");

        assert.strictEqual(result.runwayVisualRange[0].runway, "27");
        assert.strictEqual(result.runwayVisualRange[0].trend, "no change");
        assert.strictEqual(result.runwayVisualRange[0].min, 6000);
        assert.strictEqual(result.runwayVisualRange[0].minRange, "more than");
        assert.strictEqual(result.runwayVisualRange[0].max, 6000);
        assert.strictEqual(result.runwayVisualRange[0].maxRange, "exact");
    });
});

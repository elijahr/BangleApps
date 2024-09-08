"use strict";

/*
Your app can subscribe to glucose updates rather than fetch them on
demand by listening with `Bangle.on("glucose", callback)`.

The data sent to `callback` looks like:

{
    a: "%alarm",
    ar: "%arrow",
    d: "%delta",
    dl: "%dexcomlabel",
    g: "%glucose",
    o: "%obsolete_value",
    r: "%rate",
    rl: "%ratelabel",
    rv: "%rawvalue",
    s: "%sensorid",
    t: "%time",
    td: "%timediff",
    u: "%unit",
}

These values are sent from Gluco Data Handler, via a Tasker action.
*/

function getData() {
    try {
        return require("Storage").readJSON("glucosee.data.json");
    } catch (e) {
        // In case there are no user triggers yet, we show the default...
        console.error("glucosee: error loading data:", e);
        return null
    }
}

function updateData(data) {
    require("Storage").writeJSON("glucosee.data.json", data);
}

let listening = false;

function startListening() {
    if (!listening) {
        listening = true;
        Bangle.on("glucose", updateData);
    }
}

function stopListening() {
    if (listening) {
        listening = false;
        Bangle.removeListener("glucose", updateData);
    }
}

function defaultSettings() {
    return {

    };
}

function loadSettings() {
    try {
        return require("Storage").readJSON("glucosee.settings.json", true) || null
    } catch (e) {
        return null;
    }
}

function updateSettings(newSettings) {
    const settings = getSettings();
    for (let key in settings) {
        if (settings.hasOwnProperty(key) && newSettings.hasOwnProperty(key)) {
            settings[key] = newSettings[key];
        }
    }
    require("Storage").writeJSON("glucosee.settings.json", settings);
}

function getSettings() {
    const settings = defaultSettings();
    const saved = loadSettings();

    if (saved) {
        for (let key in settings) {
            if (settings.hasOwnProperty(key) && saved.hasOwnProperty(key)) {
                settings[key] = saved[key];
            }
        }
    }
    return settings;
}

function getClockInfoImg(data) {
    if (!data) data = getData();
    // let down = atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAfD4AfD4A/D8A/D8B/D+B/D+B+B+B8A+B+B+B/D+A/n8A//8Af/4AP/wAH/gAB+AA==");
    // let downRight = atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAe/4Acf4A4P8A4G8B4A+B8A+B+A+B/A+B/A+B/A+A//8A//8Af/4AP/wAH/gAB+AA==");
    // let right = atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAf/4Af74A/58A4A8BwAeBwAOBwAeBwA+B/x+B/7+A//8A//8Af/4AP/wAH/gAB+AA==");
    // let upRight = atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAf/4Af/4A+A8A/A8B/A+B+A+B8A+B4A+BwH+B4P+A8f8A//8Af/4AP/wAH/gAB+AA==");
    // let up = atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAfn4AfD4A+B8A8A8B8A+B+B+B/D+B/D+B/D+B/D+A/D8A/D8Af/4AP/wAH/gAB+AA==");
    let missed = atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAHDgAOBwAcA4AcY4A888A+48B/g+B/h+B/j+B/n+B/n+B//+A/n8A/n8Af/4AP/wAH/gAB+AA==");
    return missed;
}

function getClockInfo() {
    return {
        name: "Glucosee",
        img: getClockInfoImg(),
        items: [{
            name: "Blood glucose",
            get: function () {
                let data = getData();
                return {
                    text: data ? data.g : "",
                    // v : 10,
                    // min : 0,
                    // max : 100, - optional
                    img: getClockInfoImg(data),
                }
            },
            show: function () { },
            hide: function () { },
            // run : function() {} optional (called when tapped)
        }],
    }
}
exports.getData = getData;
exports.updateData = updateData;

exports.startListening = startListening;
exports.stopListening = stopListening;

exports.getSettings = getSettings;
exports.updateSettings = updateSettings;

exports.getClockInfoImg = getClockInfoImg;
exports.getClockInfo = getClockInfo;

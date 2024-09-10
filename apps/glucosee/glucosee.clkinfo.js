(function () {
  const storage = require("Storage");

  /*
  These values are sent from Gluco Data Handler, via a Tasker action.
  https://github.com/pachi81/GlucoDataHandler/blob/master/TASKER.md#tasker

  Tasker sends them all as strings.

  */
  let data = storage.readJSON('glucosee.data.json', 1) || {
    a: "%alarm",          // Alarm value (0: no alarm, 6/14: very high, 2/10: high, 3/11: low, 7/15: very low)
    ar: "%arrow",         // Calculated unicode arrow for the current rate value
    d: "%delta",          // Delta per minute between the current and the last value (mg/dl or mmol/l)
    dl: "%dexcomlabel",   // Calculated dexcom specific label for the current rate value
    g: "%glucose",        // Glucose value in the unit, defined in Juggluco app (mg/dl or mmol/l)
    o: "%obsolete_value", // Time in minutes (5 or 10) since last value was received (will only be set every 5 or 10 minutes)
    r: "%rate",           // Rate of change of the glucose value
    rl: "%ratelabel",     // Calculated label for the current rate value
    rv: "%rawvalue",      // Glucose value in mg/dl
    s: "%sensorid",       // Serial number of the current used sensor
    t: "%time",           // Timestamp in ms since 1970-01-01 (UTC)
    td: "%timediff",      // Duration in ms between the current and the previous received value
    u: "%unit",           // Unit of the glucose value, either mg/dl or mmol/l
  };

  let glucoseItemListening = false;
  let obsoleteItemListening = false;
  let updateTimer;
  let checkObsoleteTimer;
  let reDrawObsoleteTimer;

  function checkObsolete() {
    // Gluco Data Handler does its own obsolete value checking, and sends us an event, but we need to
    // check if the data on the watch is obsolete.
    if (Date.now() - parseInt(data.t) > 5 * 60 * 1000) {
      // Data is more than 5 mins old, store the # of minutes for display
      data.o = Math.round((Date.now() - parseInt(data.t)) / 1000 / 60).toString();
      obsoleteItem.emit("redraw");
    }
    checkObsoleteTimer = setTimeout(checkObsolete, 5 * 60 * 1000);
  }

  function reDrawObsolete() {
    obsoleteItem.emit("redraw");
    setTimeout(reDrawObsolete, 1000*60);
  }

  function updateData(d) {
    data = d;
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(function() {
      if (glucoseItemListening) glucoseItem.emit("redraw");
      if (obsoleteItemListening) {
        obsoleteItem.emit("redraw");
        if (checkObsoleteTimer) clearTimeout(checkObsoleteTimer);
        checkObsoleteTimer = setTimeout(checkObsolete, 5 * 60 * 1000);
      }
      storage.write('glucosee.data.json', data);
    }, 1000); // debounce for 1s
  }

  function prettyMs (ms) {
    if (ms > 1000 * 60 * 60 * 24) {
      const days = Math.round(ms / 1000 / 60 / 60 / 24);
      return days + 'd';
    } else if (ms > 1000 * 60 * 60) {
      const hours = Math.round(ms / 1000 / 60 / 60);
      return hours + 'h';
    } else if (ms > 1000 * 60) {
      const mins = Math.round(ms / 1000 / 60);
      return mins + 'm';
    } else {
      return '<1m';
    }
  }

  function glucoseItemImg() {
    if (data.dl === "DoubleUp") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g//8OfnnDw5ta2XZun3759++ffvj37w//8H/+A//AH/gAfgA==");
    else if (data.dl === "SingleUp") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g/D8PgfnyT55mee53n+f5/n+f5/j+fw//8H/+A//AH/gAfgA==");
    else if (data.dl === "FortyFiveUp") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g//8PAPn/j5/y+f5vn875+e+fPvj//w//8H/+A//AH/gAfgA==");
    else if (data.dl === "Flat") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g/z8P+fn/z5/8eeAHn/x5/8+f+fj/Pw/38H/+A//AH/gAfgA==");
    else if (data.dl === "FortyFiveDown") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g//8PPvn575/O+f5vn/L5/4+fAPj4Hw//8H/+A//AH/gAfgA==");
    else if (data.dl === "SingleDown") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g/n8P5/n+f5/n+e53nmZ58k+fgfj8Pw/n8H/+A//AH/gAfgA==");
    else if (data.dl === "DoubleDown") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g//8Pfvn3759++ffuk2bJhamcPDjn5w//8H/+A//AH/gAfgA==");
    return atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAHDgAOBwAcA4AcY4A888A+48B/g+B/h+B/j+B/n+B/n+B//+A/n8A/n8Af/4AP/wAH/gAB+AA==") // missed reading
  }

  const glucoseItem = {
    name: "Glucose",
    hasRange: true,
    get: function () {
      let value;
      let text;
      if (data.g == "%glucose") {
        value = 0
        text = 'no data';
      } else {
        value = parseInt(data.g);
        if (isNaN(value)) {
          value = 0;
          text = 'no data';
        } else {
          text = Math.round(value).toString();
        }
      }
      return {
        text: text,
        v: value,
        color: '#f00',
        min: 0,
        max: 500, // - optional
        img: glucoseItemImg(),
      }
    },
    show: function() {
      if (!obsoleteItemListening) Bangle.on("glucodata", updateData);
      glucoseItemListening = true;
    },
    hide: function() {
      if (!obsoleteItemListening) Bangle.removeListener("glucodata", updateData);
      glucoseItemListening = false;
    },
    // run: console.log // optional (called when tapped)
  };

  const obsoleteItem = {
    name: /*LANG*/"Obsolete Reading",
    get: function () {
      let text;
      let value;
      let color;
      if (data.o && data.o !== "%obsolete_value") {
        const mins = parseInt(data.o);
        value = mins * 1000 * 60;
        text = value + 'm ' + /*LANG*/'ago';
        color = '#f00';
      } else {
        const time = parseInt(data.t);
        if (isNaN(time)) {
          color = '#f00';
          text = /*LANG*/'no data';
          value = 0;
        } else {
          value = Date.now() - time;
          text = prettyMs(value) + /*LANG*/' ago';
          if (value <= 1000 * 60 * 5) {
            // If less than 5 mins since last reading, black
            color = '#000';
          } else {
            // otherwise red
            color = '#f00';
          }
        }
      }
      return {
        text: text,
        img: atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g3/sL/9m37Ztm2aw9m2bZt+2f//jf+w//8H/+A//AH/gAfgA=="),
        v: value, // ms
        color: color,
        min: 0,
      }
    },
    show: function() {
      if (!glucoseItemListening) Bangle.on("glucodata", updateData);
      obsoleteItemListening = true;
      if (reDrawObsoleteTimer) clearTimeout(reDrawObsoleteTimer);
      reDrawObsoleteTimer = setTimeout(reDrawObsoleteTimer, 1000*60);
    },
    hide: function() {
      if (!glucoseItemListening) Bangle.removeListener("glucodata", updateData);
      obsoleteItemListening = false;
      if (reDrawObsoleteTimer) clearTimeout(reDrawObsoleteTimer)
    },
    // run: console.log // optional (called when tapped)
  };

  return {
    name: "GlucoSee",
    // img: glucoseItemImg(),
    items: [glucoseItem, obsoleteItem],
  };
}) // must not have a semi-colon!


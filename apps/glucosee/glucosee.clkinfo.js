(function () {
  console.info("glucosee: setting up clkinfo");

  /*
  These values are sent from Gluco Data Handler, via a Tasker action.
  https://github.com/pachi81/GlucoDataHandler/blob/master/TASKER.md#tasker

  Tasker sends them all as strings.

  */
  let data = {
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

  let listenerCount = 0;

  function updateData(d) {
    console.log("glucodata: " + JSON.stringify(d, null, 4));
    data = d;
    if (d.o && d.o !== "%obsolete_value") {
      // The same Tasker task handles both the "glucose data" and "obsolete reading" events from Gluco Data Handler.
      // The data is mostly the same except that %obsolete_value won't be interpolated for a glucose reading.
      obsoleteItem.emit("redraw");
    }
    glucoseItem.emit("redraw");
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
      const v = parseInt(data.g) || 0;
      return {
        text: data.g,
        v: v,
        color: '#f00',
        min: 0,
        max: 500, // - optional
        img: glucoseItemImg(),
      }
    },
    show: function () {
      listenerCount += 1;
      if (listenerCount == 1) {
        Bangle.on("glucodata", updateData);
      }
    },
    hide: function () {
      listenerCount -= 1;
      if (listenerCount == 0) {
        Bangle.removeListener("glucodata", updateData);
      }
    },
    // run: console.log // optional (called when tapped)
  };

  let checkObsoleteTimer;

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

  function prettyMs (ms) {
    if (ms > 1000 * 60 * 60 * 24) {
      const days = Math.round(ms / 1000 / 60 / 60 / 24);
      return [days, (days === 1 ? 'day' : 'days')];
    } else if (ms > 1000 * 60 * 60) {
      const hours = Math.round(ms / 1000 / 60 / 60);
      return [hours, (hours === 1 ? 'hr' : 'hrs')];
    } else if (ms > 1000 * 60) {
      const mins = Math.round(ms / 1000 / 60);
      return [mins, (mins === 1 ? 'min' : 'mins')];
    } else {
      const secs = Math.round(ms / 1000);
      return [secs, (secs === 1 ? 'sec' : 'secs')];
    }
  }

  const obsoleteItem = {
    name: "Obsolete Reading",
    get: function () {
      let value;
      let unit;
      let color;
      if (data.o && data.o !== "%obsolete_value") {
        value = parseInt(data.o);
        unit = 'minutes';
        color = '#f00';
      } else {
        const pretty = prettyMs(Date.now() - parseInt(data.t));
        value = pretty[0];
        unit = pretty[1];
        if (value <= 5 && unit == 'minutes') {
          // If less than 5 mins since last reading, black
          color = '#000';
        } else {
          // otherwise red
          color = '#f00';
        }
      }
      const text = value+' '+unit+' ago';
      return {
        text: text,
        v: value,
        color: color,
        min: 0,
      }
    },
    show: function () {
      listenerCount += 1;
      if (listenerCount == 1) {
        Bangle.on("glucodata", updateData);
      }
      if (checkObsoleteTimer) clearTimeout(checkObsoleteTimer);
      checkObsoleteTimer = setTimeout(checkObsolete, 5 * 60 * 1000);
    },
    hide: function () {
      listenerCount -= 1;
      if (listenerCount == 0) {
        Bangle.removeListener("glucodata", updateData);
      }
      if (checkObsoleteTimer) clearTimeout(checkObsoleteTimer);
      checkObsoleteTimer = undefined;
    },
    // run: console.log // optional (called when tapped)
  };

  return {
    name: "GlucoSee",
    // img: glucoseItemImg(),
    items: [glucoseItem, obsoleteItem],
  };
}) // must not have a semi-colon!


(function () {
  console.info("glucosee: setting up clkinfo");

  let data = {
    a: "—",
    ar: "—",
    d: "—",
    dl: "—",
    g: "—",
    o: "—",
    r: "—",
    rl: "—",
    rv: "—",
    s: "—",
    t: "—",
    td: "—",
    u: "—",
  };
  /*
  data will be of the form
  {
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
      t: "%time",           // Timestamp in ms since 1.1.1970
      td: "%timediff",      // Duration in ms between the current and the previous received value
      u: "%unit",           // Unit of the glucose value, either mg/dl or mmol/l
  }

  These values are sent from Gluco Data Handler, via a Tasker action.
  https://github.com/pachi81/GlucoDataHandler/blob/master/TASKER.md#tasker
  */

  let listenerCount = 0;

  function updateData(d) {
    console.log("glucodata: " + JSON.stringify(d, null, 4));
    data = d;
    if (d.o) {
      // Gluco Data Handler sent an "obsolete reading" event
      obsoleteItem.emit("redraw");
    }
    glucoseItem.emit("redraw");
  }

  function glucoseItemImg() {
    if (data.ar === "↑↑") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g//8OfnnDw5ta2XZun3759++ffvj37w//8H/+A//AH/gAfgA==");
    else if (data.ar === "↑") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g/D8PgfnyT55mee53n+f5/n+f5/j+fw//8H/+A//AH/gAfgA==");
    else if (data.ar === "↗") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g//8PAPn/j5/y+f5vn875+e+fPvj//w//8H/+A//AH/gAfgA==");
    else if (data.ar === "→") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g/z8P+fn/z5/8eeAHn/x5/8+f+fj/Pw/38H/+A//AH/gAfgA==");
    else if (data.ar === "↘") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g//8PPvn575/O+f5vn/L5/4+fAPj4Hw//8H/+A//AH/gAfgA==");
    else if (data.ar === "↓") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g/n8P5/n+f5/n+e53nmZ58k+fgfj8Pw/n8H/+A//AH/gAfgA==");
    else if (data.ar === "↓↓") return atob("FBiBAAAAAAYAAPAAH4AD/AB/4Af+AP/wH/+B//g//8Pfvn3759++ffuk2bJhamcPDjn5w//8H/+A//AH/gAfgA==");
    return atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAHDgAOBwAcA4AcY4A888A+48B/g+B/h+B/j+B/n+B/n+B//+A/n8A/n8Af/4AP/wAH/gAB+AA==") // missed reading
  }

  function onShow() {
    listenerCount += 1;
    if (listenerCount == 1) {
      Bangle.on("glucodata", updateData);
    }
  }

  function onHide() {
    listenerCount -= 1;
    if (listenerCount == 0) {
      Bangle.removeListener("glucodata", updateData);
    }
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
    show: onShow,
    hide: onHide,
    // run: console.log // optional (called when tapped)
  };

  const obsoleteItem = {
    name: "Obsolete Reading",
    hasRange: true,
    get: function () {
      return {
        text: "100 mins since last reading",
        v: 100,
        // color: '#f00',
        min: 0,
      }
    },
    show: onShow,
    hide: onHide,
    // run: console.log // optional (called when tapped)
  };

  return {
    name: "GlucoSee",
    // img: glucoseItemImg(),
    items: [glucoseItem, obsoleteItem],
  };
}) // must not have a semi-colon!


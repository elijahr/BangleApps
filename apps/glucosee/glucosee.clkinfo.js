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

  function updateData(d) {
    data = d;
    item.emit("redraw");
  }

  function getClockInfoImg() {
    if (data.ar === "↑") return atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAfn4AfD4A+B8A8A8B8A+B+B+B/D+B/D+B/D+B/D+A/D8A/D8Af/4AP/wAH/gAB+AA==");
    else if (data.ar === "↗") return atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAf/4Af/4A+A8A/A8B/A+B+A+B8A+B4A+BwH+B4P+A8f8A//8Af/4AP/wAH/gAB+AA==");
    else if (data.ar === "→") return atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAf/4Af74A/58A4A8BwAeBwAOBwAeBwA+B/x+B/7+A//8A//8Af/4AP/wAH/gAB+AA==");
    else if (data.ar === "↘") return atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAe/4Acf4A4P8A4G8B4A+B8A+B+A+B/A+B/A+B/A+A//8A//8Af/4AP/wAH/gAB+AA==");
    else if (data.ar === "↓") return atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAH/gAP/wAfD4AfD4A/D8A/D8B/D+B/D+B+B+B8A+B+B+B/D+A/n8A//8Af/4AP/wAH/gAB+AA==");
    return atob("GBiBAAAAAAAYAAA8AAB+AAD/AAH/gAHDgAOBwAcA4AcY4A888A+48B/g+B/h+B/j+B/n+B/n+B//+A/n8A/n8Af/4AP/wAH/gAB+AA==") // missed reading
  }

  const item = {
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
        img: getClockInfoImg(),
      }
    },
    show: function () {
      Bangle.on("glucodata", updateData);
    },
    hide: function () {
      Bangle.removeListener("glucodata", updateData);
    },
    // run: console.log // optional (called when tapped)
  };

  return {
    name: "GlucoSee",
    img: getClockInfoImg(),
    items: [item],
  };
}) // must not have a semi-colon!


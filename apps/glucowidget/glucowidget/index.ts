import {
  Handler,
  GlucoseData,
  HandlerCleanup,
  onData,
} from 'glucodata';

// global["WIDGETS"] = {}; // <-- for development only

(function () {
  let data = {};

  onData((d: GlucoseData) => {
    data = d;
  });

  function draw() {
    // @ts-expect-error `g` is provided by Bangle.js APIs
    g.reset(); // reset the graphics context to defaults (color/font/etc)
    // @ts-expect-error `this` is configured by Bangle.js APIs
    g.drawString(data.g, this.x, this.y);
  }

  // @ts-expect-error `WIDGETS` is provided by Bangle.js APIs
  WIDGETS.glucowidget = {
    area: "bl", // tl (top left), tr (top right), bl (bottom left), br (bottom right), be aware that not all apps support widgets at the bottom of the screen
    width: 28, // how wide is the widget? You can change this and call Bangle.drawWidgets() to re-layout
    draw // called to draw the widget
  };

})();

// Bangle.drawWidgets(); // <-- for development only

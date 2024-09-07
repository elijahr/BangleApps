"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glucodata_1 = require("glucodata");
(function () {
    var data = {
        a: "",
        ar: "→",
        d: "",
        dl: "",
        g: "120",
        o: "",
        r: "",
        rl: "",
        rv: "",
        s: "",
        t: "",
        td: "",
        u: "",
    };
    (0, glucodata_1.onData)(function (d) {
        data = d;
        Terminal.println();
    });
    function draw() {
        g.reset();
        g.drawString(data.g + data.ar, this.x, this.y);
    }
    WIDGETS.glucowidget = {
        area: "tl",
        width: 28,
        draw: draw
    };
})();

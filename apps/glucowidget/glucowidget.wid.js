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
    Bangle.on('glucodata', function (d) {
        data = d;
        Terminal.println(JSON.stringify(d));
        console.log(JSON.stringify(d));
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

(function (back) {
    const defaults = { 'httpmode': false };
    const settings = defaults.clone();
    const storage = require('Storage');
    Object.assign(settings, storage.readJSON("glucosee.settings.json", 1) || {});
    function save() {
        storage.write("glucosee.settings.json", settings);
    }
    E.showMenu({
        '': { 'title': 'GlucoSee' },
            /*LANG*/'< Back': back,
            /*LANG*/'Polling HTTP Mode': {
            value: settings.httpmode,
            onchange: () => {
                settings.httpmode = !settings.httpmode;
                save();
            }
        },
    });
});

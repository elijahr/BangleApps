# Glucodata library

This library handles the passing of blood glucose data and alarms from various devices to your Bangle.js watch.

Installing this library by itself will not display this data to you. For that, install the [Glucose Widget](/BangleApps/?id=glucosewidget) or [Glucose Clock](/BangleApps/?id=glucoseclock) which use this library.

## Installation

To use this library you must:

1. Install [Bangle.js GadgetBridge][1].
2. Install [Glucose Data Handler][2].
3. Install [Tasker][3].
4. Install the [Glucodata → Bangle.js][1] Tasker project.

[1]: <https://play.google.com/store/apps/details?id=com.espruino.gadgetbridge.banglejs> "Bangle.js GadgetBridge"
[2]: <https://play.google.com/store/apps/details?id=de.michelinside.glucodatahandler> "Glucose Data Handler"
[3]: <https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm> "Tasker"
[4]: <taskerproject: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> "Glucodata → Bangle.js"

## Supported devices

This library receives data from Glucose Data Handler. At the time of this writing that means we can:

* receive glucose values from:
  - Juggluco
  - xDrip+
  - Eversense
  - Dexcom BYODA
* receive glucose, IOB and COB values from:
  - AndroidAPS
  - Nightscout (pebble interface)
* receive glucose values as a LibreLink follower
* receive glucose values as a Dexcom Share follower

The full list of supported devices and features is available on Glucose Data Handler's [project page](https://github.com/pachi81/GlucoDataHandler?tab=readme-ov-file#features).

## How it works

The Tasker profiles listen for the "New glucose value", "Obsolute value", and "Glucose alarm" events provided by Glucose Data Handler. The data provided via those events is assembled into a JavaScript object and sent to the Bangle.js, via the `com.banglejs.uart.tx` Intent that the Bangle.js GadgetBridge app listens for.

## Example usage

```javascript
var glucodata = require('glucodata');

/*
data will be of the form:

*/

glucodata.onData(function(data) {
  if (data.o) {
    // obsolete reading
    const obsoleteTimeInMinutes = data.o;
    if (obsoleteTimeInMinutes == 5) {
      // do something
    } else if (obsoleteTimeInMinutes == 10) {
      // do something
    } else {
      // shouldn't get here, supposedly
    }
  }
});
```

## Requests

Please file any issues on https://github.com/espruino/BangleApps/issues/new?title=[xdripevents]%20library

## Creator

Elijah Shaw-Rutschman

## Attributions

Icons used in this app are from:

  - [Diabetes icons created by Muhammad_Usman - Flaticon](https://www.flaticon.com/free-icons/diabetes)![alt text](<diabetes (1) 2 sync.png>)
  - [Refresh icons created by Tempo_doloe - Flaticon](https://www.flaticon.com/free-icons/refresh)

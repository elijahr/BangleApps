# GlucoSee

This clock info item displays blood glucose information and alarms on your Bangle.js watch.

## Installation

To use this library you must:

1. Install [Bangle.js GadgetBridge][1].
2. Install [Glucose Data Handler][2].
3. Install [Tasker][3].
4. Install the [Glucodata → Bangle.js][1] Tasker project.
5. Install a clock that supports "clock_info" items, such as [Pebble++](https://banglejs.com/apps/?id=pebblepp).

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

The Tasker profiles listen for the "New glucose value", "Obsolute value", and "Glucose alarm" events provided by Glucose Data Handler. The data provided via those events is assembled into a JavaScript object and sent to the Bangle.js device, via the `com.banglejs.uart.tx` Intent that the GadgetBridge app listens for.

## Planned features

xDrip snooze

## Requests

Please file any issues at https://github.com/espruino/BangleApps/issues/new?title=[glucosee]%20library

## Creator

Elijah Shaw-Rutschman

## Attributions

App icon was generated with https://perchance.org/ai-icon-generator.

Droplet icon created by [Good Ware](https://www.flaticon.com/authors/good-ware).

Question mark icon created by [Freepik](https://www.flaticon.com/authors/freepik).

Arrow icons created by [Ilham Fitrotul Hayat](https://www.flaticon.com/authors/ilham-fitrotul-hayat).

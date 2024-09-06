
type Alarm = string; // Alarm value (0: no alarm, 6/14: very high, 2/10: high, 3/11: low, 7/15: very low)
type Arrow = string; // Calculated unicode arrow for the current rate value
type Delta = string; // Delta per minute between the current and the last value (mg/dl or mmol/l)
type DexcomLabel = string; // Calculated dexcom specific label for the current rate value
type Glucose = string; // Glucose value in the unit, defined in Juggluco app (mg/dl or mmol/l)
type ObsoleteValue = string; // Time in minutes (5 or 10) since last value was received.
type Rate = string; // Rate of change of the glucose value
type RateLabel = string; // Calculated label for the current rate value
type RawValue = string; // Glucose value in mg/dl
type SensorId = string; // Serial number of the current used sensor
type Time = string; // Timestamp in ms since 1.1.1970 UTC
type TimeDiff = string; // Duration in ms between the current and the previous received value
type Unit = string; // Unit of the glucose value, either mg/dl or mmol/l

type HandlerCleanup = () => void;

/* Tasker sends:
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
*/

interface GlucoseData {
  a: Alarm,
  ar: Arrow,
  d: Delta,
  dl: DexcomLabel,
  g: Glucose,
  o: ObsoleteValue,
  r: Rate,
  rl: RateLabel,
  rv: RawValue,
  s: SensorId,
  t: Time,
  td: TimeDiff,
  u: Unit,
}

type Handler = (data: GlucoseData) => void;

type ChangeHandler = (
  data: GlucoseData,
  prevData: GlucoseData | null,
) => void;

(function () {
  const handlers: Handler[] = [];

  function emit(data: GlucoseData): void {
    for (let handler of handlers) {
      try {
        handler(data);
      } catch (e) {
        console.log(e);
      }
    }
  };

  function onData(handler: Handler): HandlerCleanup {
    handlers.push(handler);
    return () => {
      // Cleanup function
      const index = handlers.indexOf(handler);
      if (index >= 0) {
        handlers.splice(index, 1);
      }
    };
  };

  exports.emit = emit;
  exports.on = onData;
})();

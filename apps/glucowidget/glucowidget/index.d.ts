
export type Alarm = string; // Alarm value (0: no alarm, 6/14: very high, 2/10: high, 3/11: low, 7/15: very low)
export type Arrow = string; // Calculated unicode arrow for the current rate value
export type Delta = string; // Delta per minute between the current and the last value (mg/dl or mmol/l)
export type DexcomLabel = string; // Calculated dexcom specific label for the current rate value
export type Glucose = string; // Glucose value in the unit, defined in Juggluco app (mg/dl or mmol/l)
export type ObsoleteValue = string; // Time in minutes (5 or 10) since last value was received.
export type Rate = string; // Rate of change of the glucose value
export type RateLabel = string; // Calculated label for the current rate value
export type RawValue = string; // Glucose value in mg/dl
export type SensorId = string; // Serial number of the current used sensor
export type Time = string; // Timestamp in ms since 1.1.1970 UTC
export type TimeDiff = string; // Duration in ms between the current and the previous received value
export type Unit = string; // Unit of the glucose value, either mg/dl or mmol/l

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

export interface GlucoseData {
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

export type Handler = (data: GlucoseData) => void;
export type HandlerCleanup = () => void;

export {
  Alarm,
  Arrow,
  Delta,
  DexcomLabel,
  Glucose,
  GlucoseData,
  Handler,
  HandlerCleanup,
  ObsoleteValue,
  Rate,
  RateLabel,
  RawValue,
  SensorId,
  Time,
  TimeDiff,
  Unit,
} from './index.d'

import {
  Handler,
  GlucoseData,
  HandlerCleanup,
} from './index.d'

const handlers: Handler[] = [];

export function emit(data: GlucoseData): void {
  for (let handler of handlers) {
    try {
      handler(data);
    } catch (e) {
      console.error(e);
    }
  }
}

export function onData(handler: Handler): HandlerCleanup {
  handlers.push(handler);
  return () => {
    // Cleanup function
    const index = handlers.indexOf(handler);
    if (index >= 0) {
      handlers.splice(index, 1);
    }
  };
}

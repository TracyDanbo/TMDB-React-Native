import {Platform} from 'react-native';
import {State} from 'react-native-gesture-handler';
import Animated, {
  Value,
  SpringUtils,
  Clock,
  startClock,
  spring,
  set,
  and,
  diff,
  eq,
  not,
  abs,
  sub,
  add,
  multiply,
  cond,
  lessThan,
  stopClock,
  Easing,
  timing,
  clockRunning,
  max,
  min,
  proc,
} from 'react-native-reanimated';

export function runSpring(
  fromValue: Animated.Value<number>,
  toValue: Animated.Adaptable<number>,
  clock: Clock = new Clock(),
) {
  // const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    velocity: new Value(0),
    time: new Value(0),
  };
  const config = {
    ...SpringUtils.makeDefaultConfig(),
    toValue: new Value(0),
  };
  return [
    set(state.position, fromValue),
    set(config.toValue, toValue),
    startClock(clock),
    spring(clock, state, config),
    state.position,
  ];
}

export function runTiming(
  fromValue: Animated.Adaptable<number>,
  toValue: Animated.Adaptable<number>,
  clock: Clock = new Clock(),
) {
  // const clock = new Clock();
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
  };
  const config = {
    toValue: new Value(0),
    duration: 300,
    easing: Easing.inOut(Easing.ease),
  };
  return [
    cond(
      clockRunning(clock),
      [set(config.toValue, toValue)],
      [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, fromValue),
        set(state.frameTime, 0),
        set(config.toValue, toValue),
        startClock(clock),
      ],
    ),
    timing(clock, state, config),
    cond(state.finished, stopClock(clock)),
    state.position,
  ];
}

export const clamp = proc(
  (
    value: Animated.Adaptable<number>,
    minValue: Animated.Adaptable<number>,
    maxValue: Animated.Adaptable<number>,
  ) => min(max(value, minValue), maxValue),
);

export const snapPoint = (
  fromValue: Animated.Adaptable<number>,
  snapPoints: Animated.Adaptable<number>[],
  velocity: Animated.Adaptable<number>,
) => {
  const dragToss = 0.01;
  const endOffset = add(fromValue, multiply(dragToss, velocity));
  return snapPoints.reduce((acc, cur) => {
    const distFromSnap = abs(sub(cur, endOffset));
    return cond(lessThan(distFromSnap, abs(sub(acc, endOffset))), cur, acc);
  });
};

export const pinchBegan = (
  state: Animated.Value<State>,
): Animated.Node<0 | 1> => {
  return Platform.OS === 'ios'
    ? eq(state, State.BEGAN)
    : eq(diff(state), State.ACTIVE - State.BEGAN);
};

export const pinchActive = (
  state: Animated.Value<State>,
  numberOfPointers: Animated.Value<number>,
): Animated.Node<0 | 1> => {
  return and(
    eq(state, State.ACTIVE),
    eq(numberOfPointers, 2),
    Platform.OS === 'android' ? not(pinchBegan(state)) : 1,
  );
};

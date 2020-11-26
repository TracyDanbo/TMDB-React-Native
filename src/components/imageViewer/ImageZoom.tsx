import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import Animated, {
  add,
  and,
  eq,
  set,
  cond,
  multiply,
  event,
  sub,
  lessThan,
  useCode,
  useValue,
  not,
  onChange,
  greaterThan,
  divide,
  max,
  min,
  call,
  lessOrEq,
} from 'react-native-reanimated';
import {MediaImageType} from '../../types';
import {useOrientation} from '../../Hook';
import {SharedImg} from '../Img';
import {clamp, pinchActive, pinchBegan, runSpring} from './animation';

interface ImageZoomProps {
  image: MediaImageType;
  isActive: Animated.Node<0 | 1>;
}

const ImageZoom: React.FC<ImageZoomProps> = ({image, isActive}) => {
  const {dvWidth, dvHeight, orientation} = useOrientation();
  const pinchRef = useRef<PinchGestureHandler>(null);
  const panRef = useRef<PanGestureHandler>(null);
  const [panEnable, setpanEnable] = useState(false);
  const pinchState = useValue(State.UNDETERMINED);
  const focalX = useValue<number>(0);
  const focalY = useValue<number>(0);
  const pinchScale = useValue<number>(1);
  const pinchPointers = useValue<number>(0);

  const panTranslationX = useValue(0);
  const panTranslationY = useValue(0);
  const panState = useValue(State.UNDETERMINED);
  const pinchHandler = event([
    {
      nativeEvent: {
        focalX,
        focalY,
        state: pinchState,
        scale: pinchScale,
        numberOfPointers: pinchPointers,
      },
    },
  ]);
  const panHandler = event([
    {
      nativeEvent: {
        translationX: panTranslationX,
        translationY: panTranslationY,
        state: panState,
        // velocityX:panVelocityX,
        // velocityY:panVelocityY
      },
    },
  ]);

  const scale = useValue<number>(1);
  const isPinchBegan = pinchBegan(pinchState);
  const isPinchActive = pinchActive(pinchState, pinchPointers);
  const isPinchEnd = eq(pinchState, State.END);
  const isPanEnd = eq(panState, State.END);
  const isPanActive = eq(panState, State.ACTIVE);
  const pinchTransX = useValue(0);
  const pinchTransY = useValue(0);
  const pinchOffsetX = useValue(0);
  const pinchOffsetY = useValue(0);
  const scaleOffset = useValue(1);
  const originX = useValue(0);
  const originY = useValue(0);

  const adjustedOriginX = sub(focalX, add(dvWidth / 2, pinchOffsetX));
  const adjustedOriginY = sub(focalY, add(dvHeight / 2, pinchOffsetY));

  const panTransX = useValue(0);
  const panTransY = useValue(0);
  const panOffsetX = useValue(0);
  const panOffsetY = useValue(0);

  const minX = min(multiply(-0.5, dvWidth, sub(scale, 1)), 0);
  const maxX = max(multiply(-1, minX), 0);
  const disHeight = sub(
    dvHeight,
    divide(multiply(dvWidth, scale), image.aspect_ratio),
  );
  const minY = cond(
    lessThan(disHeight, 0),
    min(multiply(0.5, disHeight), 0),
    max(multiply(-0.5, disHeight), 0),
  );
  const maxY = max(multiply(-1, minY), 0);

  const clampedX = sub(
    clamp(add(pinchTransX, panOffsetX, panTranslationX), minX, maxX),
    panOffsetX,
    pinchTransX,
  );

  const clampedY = sub(
    clamp(add(pinchTransY, panOffsetY, panTranslationY), minY, maxY),
    panOffsetY,
    pinchTransY,
  );
  const pinchClampedX = sub(
    clamp(
      add(pinchTransX, panOffsetX, sub(adjustedOriginX, originX)),
      minX,
      maxX,
    ),
    panOffsetX,
    pinchTransX,
  );

  const pinchClampedY = sub(
    clamp(
      add(pinchTransY, panOffsetY, sub(adjustedOriginY, originY)),
      minY,
      maxY,
    ),
    panOffsetY,
    pinchTransY,
  );
  const translateX = add(panTransX, pinchTransX);
  const translateY = add(panTransY, pinchTransY);
  useCode(
    () => [
      onChange(pinchPointers, [
        cond(eq(pinchPointers, 2), [
          call([], () => {
            setpanEnable(true);
          }),
        ]),
      ]),
      onChange(pinchState, [
        cond(greaterThan(scaleOffset, 1), [
          call([], () => {
            setpanEnable(true);
          }),
        ]),
        cond(and(eq(pinchState, State.BEGAN), eq(scaleOffset, 1)), [
          call([], () => {
            setpanEnable(false);
          }),
        ]),
        cond(isPinchBegan, [
          call([], () => {
            setpanEnable(true);
          }),
        ]),
        cond(isPinchActive, [
          call([], () => {
            setpanEnable(true);
          }),
        ]),
        cond(and(isPinchEnd, greaterThan(scale, 1)), [
          [
            set(scaleOffset, scale),
            set(focalX, 0),
            set(focalY, 0),
            set(panTranslationX, 0),
            set(panTranslationY, 0),
            set(pinchOffsetX, pinchTransX),
            set(pinchOffsetY, pinchTransY),
            set(panOffsetX, panTransX),
            set(panOffsetY, panTransY),
            call([], () => {
              setpanEnable(true);
            }),
          ],
        ]),
        cond(and(isPinchEnd, lessOrEq(scale, 1)), [
          call([], () => {
            setpanEnable(false);
          }),
        ]),
      ]),
      cond(and(isPinchBegan, isActive), [
        set(originX, adjustedOriginX),
        set(originY, adjustedOriginY),
      ]),

      cond(and(isPinchActive, isActive), [
        set(scale, multiply(scaleOffset, pinchScale)),
        set(
          pinchTransX,
          add(pinchOffsetX, originX, multiply(-1, pinchScale, originX)),
        ),
        set(
          pinchTransY,

          add(pinchOffsetY, originY, multiply(-1, pinchScale, originY)),
        ),
      ]),

      cond(and(not(isPanActive), isPinchActive, isActive), [
        set(scale, multiply(scaleOffset, pinchScale)),
        set(panTransX, add(panOffsetX, pinchClampedX)),
        set(panTransY, add(panOffsetY, pinchClampedY)),
      ]),

      cond(and(isActive, isPinchEnd), [
        cond(lessThan(scale, 1), [
          set(scale, runSpring(scale, 1)),
          set(pinchTransX, runSpring(pinchTransX, 0)),
          set(pinchTransY, runSpring(pinchTransY, 0)),
          set(scaleOffset, 1),
          set(pinchOffsetX, 0),
          set(pinchOffsetY, 0),
          set(panTransX, runSpring(panTransX, 0)),
          set(panTransY, runSpring(panTransY, 0)),
          set(panOffsetX, 0),
          set(panOffsetY, 0),
        ]),
      ]),

      cond(and(isPanActive, isActive), [
        set(panTransX, add(panOffsetX, clampedX)),
        set(panTransY, add(panOffsetY, clampedY)),
      ]),
      cond(and(isPanEnd, isActive, not(isPinchActive)), [
        set(panTranslationX, 0),
        set(panTranslationY, 0),
        set(panOffsetX, panTransX),
        set(panOffsetY, panTransY),
      ]),
      onChange(isActive, [
        cond(not(isActive), [
          set(scale, 1),
          set(pinchTransX, 0),
          set(pinchTransY, 0),
          set(scaleOffset, 1),
          set(pinchOffsetX, 0),
          set(pinchOffsetY, 0),
          set(panTransX, 0),
          set(panTransY, 0),
          set(panOffsetX, 0),
          set(panOffsetY, 0),
        ]),
      ]),
    ],
    [],
  );
  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={[panRef]}
      onGestureEvent={pinchHandler}
      onHandlerStateChange={pinchHandler}>
      <Animated.ScrollView
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <PanGestureHandler
          enabled={panEnable}
          ref={panRef}
          onGestureEvent={panHandler}
          onHandlerStateChange={panHandler}
          simultaneousHandlers={[pinchRef]}>
          <Animated.View
            style={[styles.container, {width: dvWidth, height: dvHeight}]}>
            <Animated.View
              style={{
                transform: [
                  // {translateX: pinchTransX},
                  // {translateY: pinchTransY},
                  // {translateX: panTransX},
                  // {translateY: panTransY},
                  {translateX},
                  {translateY},
                  {scale},
                ],
              }}>
              <SharedImg
                shareId={`${image.file_path}.img`}
                path={image.file_path}
                imgStyle={[
                  styles.img,
                  orientation === 'portrait'
                    ? {height: dvWidth / image.aspect_ratio, width: dvWidth}
                    : {width: dvHeight * image.aspect_ratio, height: dvHeight},
                ]}
                imgType={'backdrop'}
                size={'w780'}
              />
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </Animated.ScrollView>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    resizeMode: 'cover',
  },
});

export default React.memo(ImageZoom);

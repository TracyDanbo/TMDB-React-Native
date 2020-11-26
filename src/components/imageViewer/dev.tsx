import React from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  add,
  and,
  cond,
  eq,
  event,
  lessOrEq,
  max,
  min,
  multiply,
  not,
  or,
  set,
  sub,
  useCode,
  useValue,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PinchGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {SharedImg} from '../Img';
import {MediaImageType} from '../../types';
import {HEIGHT, WIDTH} from '../../constants';
import {clamp, pinchActive, pinchBegan, runSpring} from './animation';

interface ImageViewerProps {
  image: MediaImageType;
  panRef: React.RefObject<PanGestureHandler>;
  pinchRef: React.RefObject<PinchGestureHandler>;
  panTranslationX: Animated.Value<number>;
  panTranslationY: Animated.Value<number>;
  panState: Animated.Value<State>;
  isActive: Animated.Node<0 | 1>;
  translationX: Animated.Value<number>;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  image,
  pinchRef,
  panRef,
  panTranslationX,
  panTranslationY,
  translationX,
  panState,
  isActive,
}) => {
  const scale = useValue(1);
  const scaleOffset = useValue(1);
  const focalX = useValue(0);
  const focalY = useValue(0);
  const pinchScale = useValue(1);
  const pinchState = useValue(State.UNDETERMINED);
  const numberOfPointers = useValue(0);
  const pinchHandler = event([
    {
      nativeEvent: {
        focalX,
        focalY,
        scale: pinchScale,
        state: pinchState,
        numberOfPointers,
      },
    },
  ]);

  const adjustedOriginX = useValue(0);
  const adjustedOriginY = useValue(0);

  // const originX = useValue(0);
  // const originY = useValue(0);
  const pinchTransX = useValue(0);
  const pinchTransY = useValue(0);
  const pinchOffsetX = useValue(0);
  const pinchOffsetY = useValue(0);
  const panTransX = useValue(0);
  const panTransY = useValue(0);
  const panOffsetX = useValue(0);
  const panOffsetY = useValue(0);

  const translateX = add(pinchTransX, panTransX);
  const translateY = add(pinchTransY, panTransY);
  // const adjustedOriginX = sub(focalX, add(WIDTH / 2, pinchOffsetX));
  // const adjustedOriginY = sub(focalY, add(HEIGHT / 2, pinchOffsetY));

  const minX = min(multiply(-0.5, WIDTH, sub(scale, 1)), 0);
  const maxX = max(multiply(-1, minX), 0);
  const minY = min(multiply(-0.5, HEIGHT, sub(scale, 1)), 0);
  const maxY = max(multiply(-1, minY), 0);

  const clampedX = sub(
    clamp(add(pinchTransX, panOffsetX, panTranslationX), minX, maxX),
    panOffsetX,
    pinchTransX,
  );

  const clampedY = sub(
    clamp(add(panOffsetY, panTranslationY), minY, maxY),
    panOffsetY,
  );

  useCode(
    () => [
      cond(pinchBegan(pinchState), [
        set(adjustedOriginX, sub(focalX, add(WIDTH / 2, pinchOffsetX))),
        set(adjustedOriginY, sub(focalY, add(HEIGHT / 2, pinchOffsetY))),
        // set(originX, adjustedOriginX),
        // set(originY, adjustedOriginY),
      ]),

      cond(and(pinchActive(pinchState, numberOfPointers), isActive), [
        set(scale, multiply(scaleOffset, pinchScale)),
        set(
          pinchTransX,
          add(
            pinchOffsetX,
            // sub(adjustedOriginX, originX),
            // originX,
            // multiply(-1, pinchScale, originX),
            adjustedOriginX,
            multiply(-1, pinchScale, adjustedOriginX),
          ),
        ),
        set(
          pinchTransY,
          add(
            pinchOffsetY,
            // sub(adjustedOriginY, originY),
            // originY,
            // multiply(-1, pinchScale, originY),
            adjustedOriginY,
            multiply(-1, pinchScale, adjustedOriginY),
          ),
        ),
      ]),

      cond(
        and(
          isActive,
          eq(panState, State.ACTIVE),
          // or(eq(pinchState, State.END), eq(pinchState, State.UNDETERMINED)),
        ),
        [
          [
            set(translationX, sub(panTranslationX, clampedX)),
            set(panTransX, add(panOffsetX, clampedX)),
            set(panTransY, add(panOffsetY, clampedY)),
          ],
        ],
      ),
      cond(
        // or(
        //   and(
        //     or(eq(pinchState, State.END), eq(pinchState, State.UNDETERMINED)),
        //     isActive,
        //   ),
        //   and(
        //     or(eq(panState, State.END), eq(panState, State.UNDETERMINED)),
        //     isActive,
        //   ),
        // ),
        and(
          or(eq(panState, State.END), eq(panState, State.UNDETERMINED)),
          isActive,
        ),
        [
          cond(
            lessOrEq(scale, 1),
            [
              set(scale, runSpring(scale, 1)),
              set(pinchTransX, runSpring(pinchTransX, 0)),
              set(pinchTransY, runSpring(pinchTransY, 0)),
              set(panTransX, runSpring(panTransX, 0)),
              set(panTransY, runSpring(panTransY, 0)),

              set(panOffsetX, 0),
              set(panOffsetY, 0),
              set(scaleOffset, 1),
              set(pinchOffsetX, 0),
              set(pinchOffsetY, 0),
            ],
            [
              set(scaleOffset, scale),
              set(focalX, 0),
              set(focalY, 0),
              set(pinchOffsetX, pinchTransX),
              set(pinchOffsetY, pinchTransY),
              set(panOffsetX, panTransX),
              set(panOffsetY, panTransY),
              // set(panTransX, runSpring(panTransX, 0)),
              // set(panTransY, runSpring(panTransY, 0)),
            ],
          ),
        ],
        cond(not(isActive), [
          set(scale, 1),
          set(scaleOffset, 1),
          set(focalX, 0),
          set(focalY, 0),
          set(pinchTransX, 0),
          set(pinchTransY, 0),
          set(pinchOffsetX, 0),
          set(pinchOffsetY, 0),
          set(panTransX, 0),
          set(panTransY, 0),
          set(panOffsetX, 0),
          set(panOffsetY, 0),
        ]),
      ),
    ],
    [pinchState, pinchScale, numberOfPointers],
  );
  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={[panRef]}
      onGestureEvent={pinchHandler}
      onHandlerStateChange={pinchHandler}>
      <Animated.View style={styles.container}>
        <Animated.View
          style={{
            transform: [
              {translateX: cond(isActive, translateX, 0)},
              {translateY: cond(isActive, translateY, 0)},
              {scale: cond(isActive, scale, 1)},
            ],
          }}>
          <SharedImg
            shareId={`${image.file_path}.img`}
            path={image.file_path}
            imgStyle={[styles.img, {height: WIDTH / image.aspect_ratio}]}
            imgType={'backdrop'}
            size={'w780'}
          />
        </Animated.View>
      </Animated.View>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  img: {
    width: WIDTH,
    resizeMode: 'cover',
  },
});

export default ImageViewer;

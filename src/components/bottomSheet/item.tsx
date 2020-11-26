import {useTheme} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {View, Animated, Text, StyleSheet} from 'react-native';
import {
  FlatList,
  NativeViewGestureHandler,
  PanGestureHandler,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler';
import Genres from '../genres';
import VideoVote from '../videoVote';
import {
  MODAL_IMG_WIDTH,
  MODAL_IMG_HEIGHT,
  ENDPOINT,
  STARTPOINT,
  WIDTH,
} from '../../constants';
import type {VideoType} from '../../types';
import {Img} from '../Img';

interface ItemProps {
  item: VideoType;
  index: number;
  dragY: Animated.Value;
  verticalScroll: Animated.Value;
  horizontalScroll: Animated.Value;
  translateYOffset: Animated.Value;
  flatListRef: React.Ref<FlatList<VideoType>>;
}

const Item: React.FC<ItemProps> = ({
  item,
  index,
  dragY,
  verticalScroll,
  horizontalScroll,
  translateYOffset,
  flatListRef,
}) => {
  const verticalScrollValue = useRef(0);
  const {colors} = useTheme();
  const panRef = useRef<PanGestureHandler>(null);
  const scrollRef = useRef<NativeViewGestureHandler>(null);

  const opacity = horizontalScroll.interpolate({
    inputRange: [(index - 0.5) * WIDTH, index * WIDTH, (index + 0.5) * WIDTH],
    outputRange: [0, 1, 0],
  });
  useEffect(() => {
    verticalScroll.addListener(({value}) => {
      verticalScrollValue.current = value;
    });
    return () => {
      verticalScroll.removeAllListeners();
    };
  });
  const onHandlerStateChange = ({
    nativeEvent,
  }: PanGestureHandlerStateChangeEvent) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let {velocityY, translationY} = nativeEvent;
      translationY -= verticalScrollValue.current;
      const dragToss = 0.05;
      const deltaOffsetY = translationY + dragToss * velocityY;
      translateYOffset.extractOffset();
      translateYOffset.setValue(translationY);
      translateYOffset.flattenOffset();
      dragY.setValue(0);
      if (deltaOffsetY > ENDPOINT / 2) {
        verticalScroll.setValue(0);
      }
      Animated.spring(translateYOffset, {
        velocity: velocityY,
        tension: 68,
        friction: 12,
        toValue: deltaOffsetY > ENDPOINT / 2 ? ENDPOINT : STARTPOINT,
        useNativeDriver: true,
      }).start();
    }
  };
  return (
    <PanGestureHandler
      ref={panRef}
      failOffsetX={100}
      activeOffsetY={[-5, 5]}
      simultaneousHandlers={[scrollRef, flatListRef]}
      onGestureEvent={Animated.event([{nativeEvent: {translationY: dragY}}], {
        useNativeDriver: true,
      })}
      onHandlerStateChange={onHandlerStateChange}>
      <Animated.View style={[styles.item, {opacity}]}>
        <NativeViewGestureHandler
          ref={scrollRef}
          simultaneousHandlers={[panRef, flatListRef]}>
          <Animated.ScrollView
            onScrollBeginDrag={Animated.event(
              [{nativeEvent: {contentOffset: {y: verticalScroll}}}],
              {useNativeDriver: true},
            )}
            scrollEventThrottle={1}
            showsVerticalScrollIndicator={false}>
            <View style={styles.wraper}>
              <Img
                imgStyle={styles.img}
                path={item.poster_path}
                imgType={'poster'}
              />
              <View style={styles.box}>
                <Text
                  adjustsFontSizeToFit
                  style={[styles.title, {color: colors.text}]}>
                  {item.title ? item.title : item.name}
                </Text>
                {item.media_type === 'movie' ? (
                  <Text style={[styles.info, {color: colors.text}]}>
                    Release: {item.release_date?.split('-')[0]}
                  </Text>
                ) : (
                  <Text style={[styles.info, {color: colors.text}]}>
                    First air: {item.first_air_date?.split('-')[0]}
                  </Text>
                )}

                {item.media_type === 'tv' ? (
                  <Text style={[styles.info, {color: colors.text}]}>
                    Episode Count: {item.episode_count}
                  </Text>
                ) : null}
                {item.vote_average > 0 ? (
                  <VideoVote vote={item.vote_average} />
                ) : null}
                <Genres genres={item.genre_ids} type={item.media_type} />
              </View>
            </View>
            <View style={styles.section}>
              <Text style={[styles.header, {color: colors.text}]}>
                Overview
              </Text>
              <Text style={[styles.overview, {color: colors.text}]}>
                {item.overview}
              </Text>
            </View>
          </Animated.ScrollView>
        </NativeViewGestureHandler>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  item: {
    width: WIDTH,
    height: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  wraper: {
    flexDirection: 'row',
    marginTop: 20,
  },
  img: {
    width: MODAL_IMG_WIDTH,
    height: MODAL_IMG_HEIGHT,
    marginLeft: 10,
    marginRight: 20,
    resizeMode: 'cover',
    borderRadius: 20,
  },
  box: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  vote: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteValue: {
    padding: 10,
  },

  info: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 5,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
  },

  overview: {
    fontSize: 16,
    letterSpacing: 0.5,
    marginVertical: 20,
  },
});

export default Item;

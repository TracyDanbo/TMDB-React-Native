import {useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {WIDTH, ENDPOINT, STARTPOINT, HEIGHT} from '../../constants';
import type {VideoType} from '../../types';
import Item from './item';

interface BottomSheetProps {
  dataList: VideoType[];
  translateYOffset: Animated.Value; //open BottomSheet
  target: Animated.Value; //scroll
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  dataList,
  translateYOffset,
  target,
}) => {
  const {colors} = useTheme();
  const barRef = useRef<View>(null);
  const flatListRef = useRef<FlatList<VideoType>>(null);
  const verticalScroll = useRef(new Animated.Value(0)).current;
  const horizontalScroll = useRef(new Animated.Value(0)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const reverVertialScroll = useRef(
    Animated.multiply(new Animated.Value(-1), verticalScroll),
  ).current;
  useEffect(() => {
    target.addListener((ob) => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({
          offset: ob.value * WIDTH,
          animated: true,
        });
      }
    });
    return () => {
      target.removeAllListeners();
    };
  });
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <Item
          {...{item, index}}
          dragY={dragY}
          verticalScroll={verticalScroll}
          horizontalScroll={horizontalScroll}
          translateYOffset={translateYOffset}
          flatListRef={flatListRef}
        />
      );
    },
    [dragY, verticalScroll, translateYOffset, horizontalScroll],
  );
  const translateY = Animated.add(
    translateYOffset,
    Animated.add(dragY, reverVertialScroll),
  ).interpolate({
    inputRange: [STARTPOINT, ENDPOINT],
    outputRange: [STARTPOINT, ENDPOINT],
    extrapolate: 'clamp',
  });
  const opacity = translateY.interpolate({
    inputRange: [STARTPOINT, ENDPOINT],
    outputRange: [1, 0],
  });
  return (
    <View
      style={[StyleSheet.absoluteFillObject, styles.wraper]}
      pointerEvents={'box-none'}>
      <Animated.View style={[styles.mask, {opacity}]} />
      <Animated.View
        style={[
          styles.container,
          {
            width: WIDTH,
            height: (HEIGHT * 2) / 3,
            backgroundColor: colors.card,
            transform: [{translateY}],
          },
        ]}>
        <View ref={barRef} style={styles.bar} />

        <Animated.FlatList
          ref={flatListRef}
          data={dataList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          maxToRenderPerBatch={20}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index: number) => ({
            length: WIDTH,
            offset: WIDTH * index,
            index,
          })}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: horizontalScroll}}}],
            {useNativeDriver: true},
          )}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wraper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mask: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 3,
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
  },
  barWraper: {
    width: '100%',
    height: 10,
    justifyContent: 'center',
  },
  bar: {
    position: 'absolute',
    top: 10,
    width: 50,
    height: 5,
    borderRadius: 20,
    backgroundColor: 'grey',
    alignSelf: 'center',
  },
});

export default BottomSheet;

import {useTheme} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {
  CAROUSEL_IMG_HEIGHT,
  CAROUSEL_IMG_WIDTH,
  MODAL_IMG_HEIGHT,
  MODAL_IMG_WIDTH,
  WIDTH,
} from '../../constants';

export const TextSkeleton: React.FC = () => {
  const {colors} = useTheme();
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  });
  const opacity = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, {backgroundColor: colors.border}, {opacity}]}
      />
      <Animated.View
        style={[
          styles.text,
          {backgroundColor: colors.border},
          styles.p1,
          {opacity},
        ]}
      />
      <Animated.View
        style={[
          styles.text,
          {backgroundColor: colors.border},
          styles.p2,
          {opacity},
        ]}
      />
      <Animated.View
        style={[
          styles.text,
          {backgroundColor: colors.border},
          styles.p3,
          {opacity},
        ]}
      />
    </View>
  );
};

export const HListSkeleton: React.FC = () => {
  const {colors} = useTheme();
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  });
  const opacity = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, {backgroundColor: colors.border}, {opacity}]}
      />
      <View style={styles.wraper}>
        {[...Array(Math.round(WIDTH / (MODAL_IMG_WIDTH + 20))).keys()].map(
          (i) => (
            <Animated.View key={i} style={[styles.item, {opacity}]}>
              <View style={[styles.img, {backgroundColor: colors.border}]} />
              <View
                style={[styles.itemTitle, {backgroundColor: colors.border}]}
              />
              <View
                style={[styles.itemVote, {backgroundColor: colors.border}]}
              />
            </Animated.View>
          ),
        )}
      </View>
    </View>
  );
};

export const CarouselSkeleton: React.FC = () => {
  const {colors} = useTheme();
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  });
  const opacity = value.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, {backgroundColor: colors.border}, {opacity}]}
      />
      <View style={styles.wraper}>
        {[...Array(2).keys()].map((i) => {
          return (
            <Animated.View
              key={i}
              style={[
                styles.carouselItem,
                {backgroundColor: colors.border},
                {opacity},
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  wraper: {
    flexDirection: 'row',
    marginTop: 10,
  },
  header: {
    width: '50%',
    height: 20,
    borderRadius: 20,
    marginBottom: 10,
  },
  text: {
    borderRadius: 20,
    marginTop: 10,
  },
  p1: {
    height: 15,
    width: '80%',
  },
  p2: {
    height: 15,
    width: '60%',
  },
  p3: {
    height: 15,
    width: '40%',
  },
  item: {
    width: MODAL_IMG_WIDTH,
    marginHorizontal: 10,
  },
  img: {
    width: MODAL_IMG_WIDTH,
    height: MODAL_IMG_HEIGHT,
    borderRadius: 20,
  },
  itemTitle: {
    width: '70%',
    height: 10,
    marginLeft: 5,
    marginVertical: 5,
    borderRadius: 10,
  },
  itemVote: {
    width: '30%',
    height: 10,
    borderRadius: 10,
    marginLeft: 5,
  },
  carouselItem: {
    width: CAROUSEL_IMG_WIDTH,
    height: CAROUSEL_IMG_HEIGHT,
    borderRadius: 10,
    marginRight: 10,
  },
});

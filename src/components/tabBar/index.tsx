import MaskedView from '@react-native-community/masked-view';
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  Easing,
  interpolate,
  timing,
  useValue,
} from 'react-native-reanimated';
import {useTheme} from '@react-navigation/native';
import {TABBARHEIGHT, tabs} from '../../constants';

function runtimg(value: Animated.Value<number>, toVlaue: number) {
  const config = {
    duration: 300,
    toValue: toVlaue,
    easing: Easing.inOut(Easing.ease),
  };
  timing(value, config).start();
}

interface TabBarProps {
  activeIndex: Animated.Value<number>;
}

const TabBar: React.FC<TabBarProps> = ({activeIndex}) => {
  const theme = useTheme();
  const [measurements, setMeasurements] = useState<number[]>(
    Array(tabs.length).fill(0),
  );
  const width = useValue<number>(0);
  const onLayout = (event: LayoutChangeEvent, index: number) => {
    const [...m] = measurements;
    m[index] = event.nativeEvent.layout.width;
    setMeasurements(m);
    width.setValue(measurements[0]);
  };
  const translateX = interpolate(activeIndex, {
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => {
      return (
        i *
        measurements
          .filter((_measurement, j) => j < i)
          .reduce((acc, c) => acc + c, 0)
      );
    }),
  });
  return (
    <View style={styles.tabbar}>
      <View style={styles.tabs}>
        {tabs.map((tab, index) => {
          const opacity = interpolate(activeIndex, {
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
          });

          return (
            <Animated.View
              key={tab}
              style={{opacity}}
              onLayout={(e) => onLayout(e, index)}>
              <TouchableWithoutFeedback>
                <Text style={[styles.tab, {color: theme.colors.text}]}>
                  {tab}
                </Text>
              </TouchableWithoutFeedback>
            </Animated.View>
          );
        })}
      </View>
      <MaskedView
        style={StyleSheet.absoluteFillObject}
        maskElement={
          <Animated.View
            style={[
              styles.mask,
              {
                width,
                transform: [{translateX}],
              },
            ]}
          />
        }>
        <View style={styles.tabs}>
          {tabs.map((tab, index) => {
            const onPress = () => {
              runtimg(activeIndex, index);
              runtimg(width, measurements[index]);
            };
            return (
              <Animated.View key={tab}>
                <TouchableWithoutFeedback onPress={onPress}>
                  <Text
                    style={[
                      styles.tab,
                      theme.dark
                        ? {
                            color: theme.colors.background,
                            backgroundColor: theme.colors.text,
                          }
                        : {
                            color: theme.colors.background,
                            backgroundColor: theme.colors.text,
                          },
                    ]}>
                    {tab}
                  </Text>
                </TouchableWithoutFeedback>
              </Animated.View>
            );
          })}
        </View>
      </MaskedView>
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    height: TABBARHEIGHT,
    justifyContent: 'center',
  },
  tabs: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  tab: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 20,
    textTransform: 'uppercase',
    borderRadius: 16,
  },
  mask: {
    position: 'absolute',
    backgroundColor: 'black',
    height: '100%',
    borderRadius: 16,
  },
});

export default TabBar;

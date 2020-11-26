import React from 'react';
import {StyleSheet, StatusBar} from 'react-native';
import Animated, {
  diffClamp,
  interpolate,
  useValue,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  HEADERHEIGHT,
  STATUSHEIGHT,
  TABBARHEIGHT,
  tabs,
  WIDTH,
} from '../../constants';
import Header from './header';
import {useTheme} from '@react-navigation/native';
import type {HomeScreenNavigationProp, HomeScreenRouteProp} from '../../types';
import Fresh from './fresh';
import Playing from './playing';
import Popular from './popular';
import Trend from './trend';
import TopRated from './topRated';
import TabBar from '../../components/tabBar';
import {useOrientation} from '../../Hook';

interface HomeProps {
  route: HomeScreenRouteProp;
  navigation: HomeScreenNavigationProp;
}

const Home: React.FC<HomeProps> = ({navigation}) => {
  const {dvWidth} = useOrientation();
  const theme = useTheme();
  const scroll = useValue<number>(0);
  const activeIndex = useValue<number>(0);
  const translateX = interpolate(activeIndex, {
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) => -dvWidth * i),
  });
  const translateY = interpolate(diffClamp(scroll, 0, HEADERHEIGHT), {
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor={theme.colors.background}
        barStyle={theme.dark ? 'default' : 'dark-content'}
      />

      <Animated.View
        style={[
          styles.pages,
          {width: tabs.length * dvWidth},
          {transform: [{translateX}]},
        ]}>
        {tabs.map((tab, index) => {
          const opacity = interpolate(activeIndex, {
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.5, 1, 0.5],
          });
          return (
            <Animated.View
              key={tab}
              style={{
                backgroundColor: theme.colors.background,
                width: dvWidth,
                opacity,
              }}>
              <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event([
                  {
                    nativeEvent: {
                      contentOffset: {y: scroll},
                    },
                  },
                ])}>
                <Fresh type={tab as 'movie' | 'tv'} />
                <Playing type={tab as 'movie' | 'tv'} />
                <Popular type={tab as 'movie' | 'tv'} />
                <Trend type={tab as 'movie' | 'tv'} />
                <TopRated type={tab as 'movie' | 'tv'} />
              </Animated.ScrollView>
            </Animated.View>
          );
        })}
      </Animated.View>
      <Animated.View
        style={[
          styles.nav,
          {backgroundColor: theme.colors.background},
          {transform: [{translateY}]},
        ]}>
        <Header {...{theme, navigation, scroll}} />
        <TabBar activeIndex={activeIndex} />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    // zIndex: -1,
    width: '100%',
    height: HEADERHEIGHT + TABBARHEIGHT + STATUSHEIGHT,
    position: 'absolute',
    paddingTop: STATUSHEIGHT,
    top: 0,
    left: 0,
  },
  pages: {
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    width: WIDTH,
  },
});

export default Home;

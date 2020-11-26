import {Theme} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Animated, {diffClamp, interpolate} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {HEADERHEIGHT} from '../../constants';
import type {HomeScreenNavigationProp} from '../../types';

interface HeaderProps {
  navigation: HomeScreenNavigationProp;
  theme: Theme;
  scroll: Animated.Adaptable<number>;
}

const Header: React.FC<HeaderProps> = ({theme, navigation, scroll}) => {
  const opacity = interpolate(diffClamp(scroll, 0, HEADERHEIGHT), {
    inputRange: [0, HEADERHEIGHT],
    outputRange: [1, 0],
  });
  return (
    <Animated.View
      style={[
        styles.container,
        {backgroundColor: theme.colors.background, opacity},
      ]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>
          TMDB
        </Text>

        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('search');
            }}>
            <Icon name="search" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: HEADERHEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  headerRight: {
    position: 'absolute',
    right: 0,
    marginRight: 10,
  },
});

export default Header;

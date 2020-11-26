import {Theme} from '@react-navigation/native';
import React from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {WIDTH, HEADERHEIGHT, STATUSHEIGHT, HEIGHT} from '../../constants';
import {VideoDetailScreenNavigationProp} from '../../types';

interface HeaderProps {
  scroll: Animated.Value;
  navigation: VideoDetailScreenNavigationProp;
  headerTitle: string | undefined;
  theme: Theme;
}

const Header: React.FC<HeaderProps> = ({
  scroll,
  navigation,
  headerTitle,
  theme,
}) => {
  const navOpacity = scroll.interpolate({
    inputRange: [HEIGHT * 0.6, HEIGHT * 0.6 + 10],
    outputRange: [0, 1],
  });

  const navHeaderOpacity = scroll.interpolate({
    inputRange: [HEIGHT * 0.6 + 10, HEIGHT * 0.6 + 100],
    outputRange: [0, 1],
  });

  const headertitleTransY = scroll.interpolate({
    inputRange: [HEIGHT * 0.6 + 10, HEIGHT * 0.6 + 100],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View
      style={[
        styles.nav,
        {backgroundColor: theme.colors.background, opacity: navOpacity},
      ]}>
      <Animated.View style={[styles.navHeader, {opacity: navHeaderOpacity}]}>
        <View style={styles.navHeaderLeft}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="arrow-left" color={theme.colors.text} size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.navHeaderTitleWraper}>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.navHeaderTitle,
              {color: theme.colors.text},
              {transform: [{translateY: headertitleTransY}]},
            ]}>
            {headerTitle}
          </Animated.Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    width: '100%',
    height: HEADERHEIGHT + STATUSHEIGHT,
    paddingTop: STATUSHEIGHT,
    justifyContent: 'center',
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
    elevation: 1,
  },
  navHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navHeaderLeft: {
    position: 'absolute',
    left: 0,
    marginHorizontal: 10,
  },
  navHeaderTitleWraper: {
    overflow: 'hidden',
    width: '80%',
    alignItems: 'center',
  },
  navHeaderTitle: {
    fontSize: 16,
    paddingVertical: 15,
    fontWeight: 'bold',
  },
});
export default Header;

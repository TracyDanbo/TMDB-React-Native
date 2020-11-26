import {Theme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {HEADERHEIGHT, STATUSHEIGHT} from '../../constants';
import {PeopleDetailScreenNavigationProp} from '../../types';

interface HeaderProps {
  navigation: PeopleDetailScreenNavigationProp;
  theme: Theme;
}

export const Header: React.FC<HeaderProps> = ({navigation, theme}) => {
  return (
    <View
      style={[styles.navheader, {backgroundColor: theme.colors.background}]}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <View style={styles.navheaderLeft}>
          <Icon name="arrow-back" size={24} color={theme.colors.text} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navheader: {
    position: 'absolute',
    width: '100%',
    height: HEADERHEIGHT + STATUSHEIGHT,
    justifyContent: 'center',
    paddingTop: STATUSHEIGHT,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
  },
  navheaderLeft: {
    marginHorizontal: 10,
    marginVertical: 10,
  },
});

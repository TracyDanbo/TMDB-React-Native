import {Theme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {CreditType} from '../../types';

interface BiographyProps {
  mediaInfo: CreditType;
  theme: Theme;
}

export const Biography: React.FC<BiographyProps> = ({theme, mediaInfo}) => {
  return (
    <View style={[styles.section, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Biography
        </Text>
      </View>
      <Text style={[styles.biography, {color: theme.colors.text}]}>
        {mediaInfo.biography
          ? mediaInfo.biography
          : "We don't have a biography for Ryu Seong-hee."}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: 'bold',
  },
  biography: {
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    letterSpacing: 0.5,
  },
});

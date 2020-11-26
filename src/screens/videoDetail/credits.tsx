import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Theme} from '@react-navigation/native';
import {CreditList} from '../../components/credit';
import {CreditType} from '../../types';

interface CreditsProps {
  cast: CreditType[];
  crew: CreditType[];
  theme: Theme;
}

const Credits: React.FC<CreditsProps> = ({crew, cast, theme}) => {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          cast & crew
        </Text>
      </View>
      <CreditList casts={cast} crews={crew} />
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
});

export default Credits;

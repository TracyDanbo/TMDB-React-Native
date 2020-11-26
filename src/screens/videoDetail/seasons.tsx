import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Theme} from '@react-navigation/native';
import {SeasonList} from '../../components/video';
import {SeasonType} from '../../types';

interface SeasonsProps {
  seasons: SeasonType[] | null;
  theme: Theme;
}

const Seasons: React.FC<SeasonsProps> = ({seasons, theme}) => {
  return (
    <>
      {seasons ? (
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Seasons
            </Text>
          </View>
          <SeasonList seasonList={seasons} />
        </View>
      ) : null}
    </>
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

export default Seasons;

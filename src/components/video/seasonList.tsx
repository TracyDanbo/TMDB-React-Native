import {useTheme} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {IMG_HEIGHT, IMG_WIDTH} from '../../constants';
import type {SeasonType} from '../../types';
import {Img} from '../Img';

const areEqual = (preProps: SeasonProps, nextProps: SeasonProps) => {
  if (preProps.data.id === nextProps.data.id) {
    return true;
  }
  return false;
};

interface SeasonProps {
  data: SeasonType;
}

const Season: React.FC<SeasonProps> = React.memo(({data}) => {
  const theme = useTheme();

  return (
    <View style={styles.seasonContainer}>
      <Img
        path={data.poster_path}
        imgStyle={styles.poster}
        imgType={'poster'}
      />
      <Text numberOfLines={1} style={[styles.name, {color: theme.colors.text}]}>
        {data.name}
      </Text>
      <Text style={[styles.season, {color: theme.colors.text}]}>{`${
        data.air_date ? data.air_date.split('-')[0] + ' | ' : ''
      }${data.episode_count} Episodes`}</Text>
    </View>
  );
}, areEqual);

interface SeasonListProps {
  seasonList: SeasonType[];
}

const SeasonList: React.FC<SeasonListProps> = ({seasonList}) => {
  const renderItem = useCallback(({item}) => {
    return <Season data={item} />;
  }, []);
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      data={seasonList}
      keyExtractor={(item) => `tv.${item.id.toString()}`}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  seasonContainer: {
    width: IMG_WIDTH,
    margin: 10,
    borderRadius: 5,
  },
  poster: {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    borderRadius: 5,
  },
  name: {
    textAlign: 'center',
    fontSize: 18,
  },
  season: {
    fontSize: 10,
    textAlign: 'center',
  },
});

export default SeasonList;

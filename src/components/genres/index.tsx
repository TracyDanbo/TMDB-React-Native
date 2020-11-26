import {useTheme} from '@react-navigation/native';
import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {genreContext} from '../../context';
import {GenreType} from '../../types';

interface GenresProps {
  genres: GenreType[] | number[];
  type?: 'tv' | 'movie';
}

const Genres: React.FC<GenresProps> = ({genres, type}) => {
  const genreOb = useContext(genreContext);
  const {colors} = useTheme();
  let genreObList = genres;

  if (typeof genres[0] === 'number' && type) {
    genreObList = genres.map((g) => genreOb[type][g]).filter((g) => Boolean(g));
  }
  return (
    <View style={styles.genres}>
      {genreObList.map((item: GenreType) => {
        return (
          <Text
            style={[
              styles.genre,
              {backgroundColor: colors.border, color: colors.text},
            ]}
            key={item.id}>
            {item.name}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  genres: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genre: {
    fontSize: 14,
    fontWeight: '600',
    padding: 8,
    borderRadius: 5,
    // marginLeft: 10,
    marginRight: 5,
    marginTop: 5,
    // opacity: 0.85,
  },
});

export default Genres;

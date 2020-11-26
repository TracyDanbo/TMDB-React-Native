import {Theme} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, ListRenderItem} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {CreditType, VideoType} from '../../types';

interface KnowForProps {
  theme: Theme;
  mediaInfo: CreditType;
  credits: {
    cast: VideoType[];
    crew: VideoType[];
  };
  renderItem: ListRenderItem<VideoType>;
}

export const KnowFor: React.FC<KnowForProps> = ({
  theme,
  mediaInfo,
  credits,
  renderItem,
}) => {
  return (
    <View style={[styles.section, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Known For
        </Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={
          mediaInfo.known_for_department === 'Acting'
            ? credits.cast
            : credits.crew
        }
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
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

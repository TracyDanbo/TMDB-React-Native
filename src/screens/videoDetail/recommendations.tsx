import {Theme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {VideoList} from '../../components/video';
import {MediaType, VideoType} from '../../types';

interface RecommendationsProps {
  recommendations: VideoType[] | null;
  loadMore: () => Promise<{
    status: 'done' | 'failed' | 'no more data';
  }>;
  type: MediaType;
  theme: Theme;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  loadMore,
  type,
  theme,
}) => {
  return (
    <>
      {recommendations ? (
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              recommendations
            </Text>
          </View>
          <VideoList
            dataList={recommendations}
            type={type}
            loadMore={loadMore}
            section="recommendations"
          />
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

export default Recommendations;

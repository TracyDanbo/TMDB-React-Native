import {useNavigation, useRoute, useTheme} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Video from './video';
import {IMG_HEIGHT, ITEM_WIDTH} from '../../constants';
import type {
  HomeScreenNavigationProp,
  HomeScreenRouteProp,
  MediaType,
  SectionType,
  VideoType,
} from '../../types';

interface VideoListProps {
  dataList: VideoType[];
  type: MediaType;
  section: SectionType;
  loadMore: () => Promise<{status: 'done' | 'failed' | 'no more data'}>;
}

const VideoList: React.FC<VideoListProps> = ({
  dataList,
  type,
  loadMore,
  section,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();
  const {colors} = useTheme();

  const renderItem = useCallback(
    ({item}) => {
      const onPress = () => {
        navigation.push('videoDetail', {
          video: item,
          type,
          section,
          name: route.name,
        });
      };
      return (
        <Video video={item} type={type} section={section} onPress={onPress} />
      );
    },
    [navigation, type, section, route],
  );
  const getItemLayout = useCallback((_, index) => {
    return {
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    };
  }, []);
  const onEndReached = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const {status} = await loadMore();
    if (status === 'done' || status === 'no more data') {
      setIsLoading(false);
    }
  };
  const refreshIndicator = useCallback(() => {
    if (isLoading) {
      return (
        <View style={styles.indicator}>
          <ActivityIndicator size={'small'} color={colors.text} />
        </View>
      );
    } else {
      return null;
    }
  }, [isLoading, colors]);

  return (
    <FlatList
      data={dataList}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      getItemLayout={getItemLayout}
      onEndReached={onEndReached}
      ListFooterComponent={refreshIndicator}
    />
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: ITEM_WIDTH / 2,
    height: IMG_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoList;

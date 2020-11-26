import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {
  VideoType,
  SectionType,
  MediaType,
  HomeScreenRouteProp,
} from '../../types';
import {
  CAROUSEL_IMG_HEIGHT,
  CAROUSEL_IMG_WIDTH,
  CAROUSEL_ITEM_WIDTH,
  WIDTH,
} from '../../constants';
import {SharedImg} from '../Img';

interface CarouselPosterProps {
  dataList: VideoType[];
  type: MediaType;
  section: SectionType;
}

const CarouselPoster: React.FC<CarouselPosterProps> = ({
  dataList,
  type,
  section,
}) => {
  const navigation = useNavigation();
  const route = useRoute<HomeScreenRouteProp>();
  const scroll = useRef(new Animated.Value(0)).current;
  const renderItem = useCallback(
    ({item, index}: {item: VideoType; index: number}) => {
      const inputRange = [
        (index - 1) * CAROUSEL_ITEM_WIDTH,
        index * CAROUSEL_ITEM_WIDTH,
        (index + 1) * CAROUSEL_ITEM_WIDTH,
      ];
      const scale = scroll.interpolate({
        inputRange,
        outputRange: [0.9, 1, 0.9],
      });
      const opacity = scroll.interpolate({
        inputRange,
        outputRange: [0.5, 1, 0.5],
      });
      // const imgScale = scroll.interpolate({
      //   inputRange,
      //   outputRange: [1, 1.1, 1],
      // });
      return (
        <Animated.View style={[styles.wraper, {opacity, transform: [{scale}]}]}>
          <TouchableNativeFeedback
            onPress={() =>
              navigation.navigate('videoDetail', {
                video: item,
                type,
                section,
                key: route.key,
              })
            }>
            <SharedImg
              imgStyle={styles.img}
              shareId={`${section}.${type}.${item.id}.poster`}
              path={item.poster_path}
              imgType={'poster'}
            />
          </TouchableNativeFeedback>
        </Animated.View>
      );
    },
    [type, navigation, scroll, section, route],
  );

  return (
    <View>
      <Animated.FlatList
        data={dataList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment={'start'}
        snapToInterval={CAROUSEL_ITEM_WIDTH}
        decelerationRate={'fast'}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scroll}}}],
          {useNativeDriver: true},
        )}
        ListHeaderComponent={
          <View style={{width: (WIDTH - CAROUSEL_ITEM_WIDTH) / 2}} />
        }
        ListFooterComponent={
          <View style={{width: (WIDTH - CAROUSEL_ITEM_WIDTH) / 2}} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wraper: {
    borderRadius: 10,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  img: {
    width: CAROUSEL_IMG_WIDTH,
    height: CAROUSEL_IMG_HEIGHT,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  banner: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: '100%',
    height: '30%',
  },
  title: {
    fontSize: 24,
    color: 'white',
  },
});

export default CarouselPoster;

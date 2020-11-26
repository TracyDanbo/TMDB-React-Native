import React, {useCallback} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {eq} from 'react-native-reanimated';
import {MediaImageType} from '../../types';
import {useOrientation} from '../../Hook';
import ImageZoom from './ImageZoom';
const ReFlatList = Animated.createAnimatedComponent(FlatList);
interface ImageViewerProps {
  images: MediaImageType[];
  index: number;
  activeIndex: Animated.Value<number>;
}
const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  index,
  activeIndex,
}) => {
  const {dvWidth, dvHeight} = useOrientation();
  const renderItem = useCallback(
    ({item, index: i}: {item: MediaImageType; index: number}) => {
      const isActive = eq(activeIndex, i);
      return <ImageZoom image={item} isActive={isActive} />;
    },
    [activeIndex],
  );
  const getItemLayout = useCallback(
    (_: any, i: number) => ({
      length: dvWidth,
      offset: dvWidth * i,
      index: i,
    }),
    [dvWidth],
  );

  return (
    <Animated.View style={styles.container}>
      <ReFlatList
        key={dvHeight}
        data={images}
        keyExtractor={(item: MediaImageType) => item.file_path}
        renderItem={renderItem}
        horizontal
        initialScrollIndex={index}
        showsHorizontalScrollIndicator={false}
        maxToRenderPerBatch={3}
        windowSize={3}
        pagingEnabled
        getItemLayout={getItemLayout}
        onMomentumScrollEnd={({
          nativeEvent,
        }: NativeSyntheticEvent<NativeScrollEvent>) => {
          activeIndex.setValue(
            Math.round(Math.round(nativeEvent.contentOffset.x) / dvWidth),
          );
        }}
      />
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
});

export default ImageViewer;

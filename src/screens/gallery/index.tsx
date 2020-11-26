import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Animated, {add, concat, useValue} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewer from '../../components/imageViewer';
import {HEADERHEIGHT, STATUSHEIGHT, WIDTH} from '../../constants';
import {GalleryScreenNavigationProp, GalleryScreenRouteProp} from '../../types';

const AnimatedInput = Animated.createAnimatedComponent(TextInput);

interface GalleryProps {
  route: GalleryScreenRouteProp;
  navigation: GalleryScreenNavigationProp;
}

const Gallery: React.FC<GalleryProps> = ({route, navigation}) => {
  const {images, index} = route.params;
  const activeIndex = useValue(index);
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ImageViewer images={images} index={index} activeIndex={activeIndex} />
      <View style={[styles.header]}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.headerLeft}
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon name="arrow-left" color={'white'} size={24} />
          </TouchableOpacity>
          <AnimatedInput
            text={concat(add(activeIndex, 1), ` / ${images.length}`)}
            style={styles.headerTitle}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'row',
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: HEADERHEIGHT + STATUSHEIGHT,
    paddingTop: STATUSHEIGHT,
    backgroundColor: 'transparent',
  },
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLeft: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 16,
  },
  img: {
    width: WIDTH,
    resizeMode: 'cover',
  },
});

export default Gallery;

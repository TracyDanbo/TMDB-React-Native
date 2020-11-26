import React from 'react';
import {Animated, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {YouTubeStandaloneAndroid} from 'react-native-youtube';
import {SharedImg} from '../../components/Img';
import {YOUTUBE_API} from '@env';
import {FULL_IMG_HEIGHT, HEIGHT} from '../../constants';
import {MediaVideoType} from '../../types';
interface BackdropProps {
  scroll: Animated.Value;
  video: MediaVideoType | null;
  shareId: string;
  path: string;
}

const Backdrop: React.FC<BackdropProps> = ({scroll, video, shareId, path}) => {
  const scale = scroll.interpolate({
    inputRange: [0, 400],
    outputRange: [1, 1.3],
    extrapolate: 'clamp',
  });
  const translateY = scroll.interpolate({
    inputRange: [0, 400],
    outputRange: [0, 400 * 0.9],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View style={[{transform: [{scale}, {translateY}]}]}>
      <SharedImg
        imgStyle={styles.img}
        shareId={shareId}
        imgType={'poster'}
        path={path}
      />
      {video ? (
        <Animatable.View
          animation="bounceIn"
          delay={300}
          useNativeDriver
          style={styles.playButton}>
          <TouchableOpacity
            onPress={() => {
              YouTubeStandaloneAndroid.playVideo({
                apiKey: YOUTUBE_API,
                videoId: video.key,
                autoplay: true,
                lightboxMode: false,
              })
                .then(() => {
                  console.log('Android Standalone Player Finished');
                })
                .catch((errorMessage) => {
                  console.log(errorMessage);
                });
            }}>
            <Icon name="play-circle" size={48} color="white" />
          </TouchableOpacity>
        </Animatable.View>
      ) : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  img: {
    height: FULL_IMG_HEIGHT,
    resizeMode: 'cover',
  },

  playButton: {
    position: 'absolute',
    top: HEIGHT / 3 - 24,
    alignSelf: 'center',
  },
});

export default Backdrop;

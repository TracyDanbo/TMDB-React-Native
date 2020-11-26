import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {MediaType, SectionType, VideoType} from '../../types';
import {IMG_HEIGHT, IMG_WIDTH} from '../../constants';
import {withTheme} from '../../HOC';
import {useTheme} from '@react-navigation/native';
import {SharedImg} from '../Img';

interface VideoProps {
  video: VideoType;
  type?: MediaType;
  color: string;
  section?: SectionType;
  onPress: () => void;
}

const areEqual = (preProps: VideoProps, nextProps: VideoProps) => {
  if (preProps.video.id === nextProps.video.id) {
    return true;
  }
  return false;
};

const Video: React.FC<VideoProps> = React.memo(
  ({video, onPress, section, type}) => {
    const theme = useTheme();
    return (
      <View style={[styles.container]}>
        <TouchableNativeFeedback onPress={onPress}>
          <SharedImg
            path={video.poster_path}
            shareId={`${section}.${type}.${video.id}.poster`}
            imgStyle={styles.img}
            imgType={'poster'}
          />
          <Text
            style={[styles.title, {color: theme.colors.text}]}
            numberOfLines={1}
            ellipsizeMode={'tail'}>
            {video.title ? video.title : video.name}
          </Text>
          {video.vote_average > 0 ? (
            <View style={styles.vote}>
              <Text style={[styles.voteValue, {color: theme.colors.text}]}>
                {video.vote_average.toFixed(1)}
              </Text>
              <Icon name="star" size={10} color={theme.colors.text} />
            </View>
          ) : null}
        </TouchableNativeFeedback>
      </View>
    );
  },
  areEqual,
);

const styles = StyleSheet.create({
  container: {
    width: IMG_WIDTH,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  img: {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    borderRadius: 10,
    resizeMode: 'cover',
  },

  vote: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteValue: {
    marginRight: 10,
    fontSize: 12,
  },
});

export default withTheme(Video);

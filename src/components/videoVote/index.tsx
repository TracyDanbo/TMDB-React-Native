import MaskedView from '@react-native-community/masked-view';
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface VideoVoteProps {
  vote: number;
}

const VideoVote: React.FC<VideoVoteProps> = ({vote}) => {
  const {colors} = useTheme();
  return (
    <View style={styles.vote}>
      <View>
        <View style={styles.mask}>
          {[...Array(5).keys()].map((i) => (
            <Icon key={i} name="star" size={16} color={colors.border} />
          ))}
        </View>
        <MaskedView
          style={StyleSheet.absoluteFillObject}
          maskElement={
            <View style={styles.mask}>
              {[...Array(5).keys()].map((i) => (
                <Icon key={i} name="star" size={16} color={'white'} />
              ))}
            </View>
          }>
          <View
            style={[
              styles.backdrop,
              {
                backgroundColor: colors.primary,
                width: (vote / 2) * 16,
              },
            ]}
          />
        </MaskedView>
      </View>
      <Text style={[styles.voteValue, {color: colors.text}]}>
        {vote.toFixed(1)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mask: {
    flexDirection: 'row',
  },
  backdrop: {
    height: 16,
  },
  vote: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteValue: {
    padding: 10,
  },
});

export default VideoVote;

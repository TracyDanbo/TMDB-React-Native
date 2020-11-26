import {useTheme} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Genres from '../../components/genres';
import {TextSkeleton} from '../../components/skeleton';
import VideoVote from '../../components/videoVote';
import type {MediaType, SectionType, VideoType} from '../../types';

interface VideoMetaProps {
  data: VideoType;
  type: MediaType;
  section: SectionType;
}

const VideoMeta: React.FC<VideoMetaProps> = ({data, type, section}) => {
  const {colors} = useTheme();
  const release =
    type === 'movie'
      ? section === 'Upcoming'
        ? `Release: ${moment(data.release_date).format('MMM DD,yyyy')}`
        : `Release: ${data.release_date?.split('-')[0]}`
      : section === 'AiringToday'
      ? `Last_Air: ${moment(data.last_air_date).format('MMM DD,yyyy')}`
      : `First air: ${data.first_air_date?.split('-')[0]}`;
  let runtime = `Runtime: ${Math.floor((data.runtime as number) / 60)}h ${
    (data.runtime as number) % 60
  }min`;
  runtime = runtime === 'Runtime: 0h 0min' ? 'Runtime: unknow' : runtime;
  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: colors.text}]}>
        {data.title ? data.title : data.name}
      </Text>
      {!data.status ? (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{marginTop: 10}}>
          <TextSkeleton />
        </View>
      ) : (
        <>
          <Text style={[styles.info, {color: colors.text}]}>{release}</Text>
          {type === 'movie' ? (
            <Text style={[styles.info, {color: colors.text}]}>{runtime}</Text>
          ) : null}
          {type === 'tv' ? (
            <Text style={[styles.info, {color: colors.text}]}>
              Seasons: {data.number_of_seasons}
            </Text>
          ) : null}
          {data.vote_average > 0 ? (
            <View style={styles.vote}>
              <VideoVote vote={data.vote_average} />
            </View>
          ) : null}
          {data.genres && data.genres.length > 0 ? (
            <View style={styles.genres}>
              <Genres genres={data.genres} type={type} />
            </View>
          ) : null}
          <View>
            <Text style={[styles.header, {color: colors.text}]}>Overview</Text>
            <Text style={[styles.overview, {color: colors.text}]}>
              {data.overview
                ? data.overview
                : "We don't have an overview translated in English. Help us expand our database by adding one."}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  info: {
    marginHorizontal: 10,
    fontSize: 16,
    opacity: 0.7,
    marginTop: 5,
  },
  vote: {
    marginHorizontal: 10,
  },
  voteValue: {
    padding: 10,
  },
  genres: {
    marginLeft: 10,
    marginBottom: 20,
  },

  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginTop: 10,
  },
  overview: {
    fontSize: 20,
    marginTop: 30,
    marginHorizontal: 10,
    letterSpacing: 0.5,
  },
});

export default VideoMeta;

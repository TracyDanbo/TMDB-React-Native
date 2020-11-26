import {useNavigation, useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import {VideoList} from '../../components/video';
import * as TMDB from '../../API';
import {HomeScreenNavigationProp} from '../../types';
import {HListSkeleton} from '../../components/skeleton';

interface PlayingProps {
  type: 'movie' | 'tv';
}

const Playing: React.FC<PlayingProps> = ({type}) => {
  const [data, setData] = useState({results: [], page: 0, totalPage: 1});
  const [isReady, setReady] = useState(false);

  const source = useRef(axios.CancelToken.source()).current;
  const timer = useRef<NodeJS.Timeout>();
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const goToMore = useCallback(() => {
    navigation.push('more', {
      type,
      section: type === 'movie' ? 'nowPlaying' : 'onAir',
    });
  }, [navigation, type]);
  const fetchData = useCallback(async (): Promise<{
    status: 'done' | 'failed' | 'no more data';
  }> => {
    try {
      if (data.page < data.totalPage) {
        let playing;
        if (type === 'movie') {
          playing = await (await TMDB.nowPlaying(source, data.page + 1)).data;
        } else {
          playing = await (await TMDB.onAir(source, data.page + 1)).data;
        }
        setData({
          results: data.results.concat(playing.results),
          page: playing.page,
          totalPage: playing.total_pages,
        });
        return {status: 'done'};
      }
      return {status: 'no more data'};
    } catch (error) {
      ToastAndroid.showWithGravity(
        error.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      if (error.message === 'Network Error') {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
          fetchData();
        }, 10000);
      }
      return {status: 'failed'};
    }
  }, [data, source, type]);

  useEffect(() => {
    const init = async () => {
      await fetchData();
      setReady(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View style={styles.section}>
      {isReady && data.results.length > 0 ? (
        <>
          <View style={styles.headerContainer}>
            <Text style={[styles.header, {color: theme.colors.text}]}>
              {type === 'movie' ? 'Now Playing' : 'On Air'}
            </Text>
            <TouchableOpacity onPress={goToMore}>
              <Text style={[styles.more, {color: theme.colors.text}]}>
                See more
              </Text>
            </TouchableOpacity>
          </View>
          <VideoList
            dataList={data.results}
            type={type}
            loadMore={fetchData}
            section={type === 'movie' ? 'nowPlaying' : 'onAir'}
          />
        </>
      ) : (
        <View style={styles.section}>
          <HListSkeleton />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingBottom: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  more: {
    paddingHorizontal: 10,
  },
});

export default Playing;

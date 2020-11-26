import {useTheme} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Text, ToastAndroid} from 'react-native';
import axios from 'axios';
import * as TMDB from '../../API';
import CarouselPoster from '../../components/carouselPoster';
import {CarouselSkeleton} from '../../components/skeleton';

interface FreshProps {
  type: 'movie' | 'tv';
}

const Fresh: React.FC<FreshProps> = ({type}) => {
  const [data, setData] = useState({results: [], page: 0, totalPage: 1});
  const [isReady, setReady] = useState(false);

  const source = useRef(axios.CancelToken.source()).current;
  const timer = useRef<NodeJS.Timeout>();
  const theme = useTheme();

  const fetchData = useCallback(async (): Promise<{
    status: 'done' | 'failed' | 'no more data';
  }> => {
    try {
      if (data.page < data.totalPage) {
        let fresh;
        if (type === 'movie') {
          fresh = await (await TMDB.getUpcomingMoives(source, data.page + 1))
            .data;
        } else {
          fresh = await (await TMDB.getTvAiringToday(source, data.page + 1))
            .data;
        }
        setData({
          results: data.results.concat(fresh.results),
          page: fresh.page,
          totalPage: fresh.total_pages,
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
    <>
      {isReady && data.results.length > 0 ? (
        <View style={styles.section}>
          <Text style={[styles.header, {color: theme.colors.text}]}>
            {type === 'movie' ? 'Upcoming' : 'Airing Today'}
          </Text>
          <View style={styles.Container}>
            <CarouselPoster
              dataList={data.results}
              type={type}
              section={type === 'movie' ? 'Upcoming' : 'AiringToday'}
            />
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <CarouselSkeleton />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingBottom: 20,
    paddingTop: 100,
  },

  Container: {
    paddingTop: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
});

export default Fresh;

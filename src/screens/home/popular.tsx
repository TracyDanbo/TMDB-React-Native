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

interface PopularProps {
  type: 'movie' | 'tv';
}

const Popular: React.FC<PopularProps> = ({type}) => {
  const [data, setData] = useState({results: [], page: 0, totalPage: 1});
  const [isReady, setReady] = useState(false);
  const source = useRef(axios.CancelToken.source()).current;
  const timer = useRef<NodeJS.Timeout>();
  const theme = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const goToMore = useCallback(() => {
    navigation.push('more', {type, section: 'popular'});
  }, [navigation, type]);
  const fetchData = useCallback(async (): Promise<{
    status: 'done' | 'failed' | 'no more data';
  }> => {
    try {
      if (data.page < data.totalPage) {
        const {data: popular} = await TMDB.discovery(
          source,
          type,
          data.page + 1,
          'popularity.desc',
        );
        setData({
          results: data.results.concat(popular.results),
          page: popular.page,
          totalPage: popular.total_pages,
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
              Popular
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
            section="popular"
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

export default Popular;

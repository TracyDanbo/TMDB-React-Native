import {Theme} from '@react-navigation/native';
import React, {Component} from 'react';
import {StyleSheet, Animated, StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import * as TMDB from '../../API';
import VideoMeta from './videoMeta';
import * as Animatable from 'react-native-animatable';
import {HListSkeleton} from '../../components/skeleton';
import Credits from './credits';
import Seasons from './seasons';
import Recommendations from './recommendations';
import Backdrop from './backdrop';
import Header from './header';
import {withTheme} from '../../HOC';
import {HEIGHT} from '../../constants';

import type {
  CreditType,
  MediaImageType,
  MediaType,
  MediaVideoType,
  SeasonType,
  SectionType,
  VideoDetailScreenNavigationProp,
  VideoDetailScreenRouteProp,
  VideoType,
} from '../../types';
import Images from './images';

interface VideoDetailProps {
  route: VideoDetailScreenRouteProp;
  navigation: VideoDetailScreenNavigationProp;
  theme: Theme;
}

interface VideoDetialState {
  mediaInfo: VideoType;
  recommendations: VideoType[];
  recommendations_page: number;
  recommendations_totalPage: number;
  credits: {
    crew: CreditType[];
    cast: CreditType[];
  };
  seasons: SeasonType[];
  videos: MediaVideoType[];
  images: MediaImageType[];
  type: MediaType;
  section: SectionType;
  isReady: boolean;
}

class VideoDetail extends Component<VideoDetailProps, VideoDetialState> {
  state: VideoDetialState;
  _isMounted = false;
  scroll = new Animated.Value(0);
  source = axios.CancelToken.source();
  timer: NodeJS.Timeout | undefined;
  constructor(props: VideoDetailProps) {
    super(props);
    this.state = {
      mediaInfo: this.props.route.params.video,
      recommendations: [],
      recommendations_page: 1,
      recommendations_totalPage: 1,
      credits: {
        cast: [],
        crew: [],
      },
      seasons: [],
      videos: [],
      images: [],
      type: this.props.route.params.type,
      section: this.props.route.params.section,
      isReady: false,
    };
    this.updateRecommendations = this.updateRecommendations.bind(this);
    this.initLoad = this.initLoad.bind(this);
  }
  async componentDidMount() {
    await this.initLoad();
  }
  componentWillUnmount() {
    this.source.cancel('video: cancel request');
    this._isMounted = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  async initLoad() {
    this._isMounted = true;
    try {
      const {data} = await TMDB.getVideoDetail(
        this.source,
        this.state.mediaInfo.id,
        this.state.type,
      );
      const {
        recommendations,
        credits: {crew, cast},
        seasons,
        videos,
        images: {backdrops, posters},
        ...mediaInfo
      } = data;

      if (this._isMounted) {
        this.setState({
          mediaInfo,
          recommendations: recommendations.results,
          recommendations_page: recommendations.page,
          recommendations_totalPage: recommendations.total_pages,
          credits: {
            crew: this.obFilter(crew),
            cast: this.obFilter(cast),
          },
          seasons: seasons ? seasons : [],
          videos: videos.results,
          images: backdrops.concat(posters),
          isReady: true,
        });
      }
    } catch (error) {
      if (error.message === 'Network Error') {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.initLoad();
        }, 10000);
      }
    }
  }
  obFilter(obList: any) {
    let ids = new Set();
    let filtedList = obList
      .map((i: CreditType) => {
        if (!ids.has(i.id)) {
          ids.add(i.id);
          return i;
        }
      })
      .filter((j: any) => Boolean(j));
    return filtedList;
  }
  async updateRecommendations(): Promise<{
    status: 'done' | 'failed' | 'no more data';
  }> {
    try {
      if (
        this.state.recommendations_page < this.state.recommendations_totalPage
      ) {
        const {data: recommendations} = await TMDB.getVideoRecommendations(
          this.source,
          'tv',
          this.state.recommendations_page + 1,
        );
        this.setState((preState) => ({
          ...preState,
          recommendations: preState.recommendations.concat(
            recommendations.results,
          ),
          recommendations_page: recommendations.page,
        }));
        return {status: 'done'};
      }
      return {status: 'no more data'};
    } catch (error) {
      return {status: 'failed'};
    }
  }
  render() {
    const {
      mediaInfo,
      seasons,
      credits,
      recommendations,
      type,
      section,
      videos,
      images,
      isReady,
    } = this.state;
    const {theme} = this.props;

    const animation = {
      from: {opacity: 0, transform: [{translateY: HEIGHT * 0.3}]},
      to: {opacity: 1, transform: [{translateY: 0}]},
    };

    return (
      <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
        <StatusBar
          animated
          translucent={true}
          backgroundColor={'rgba(0,0,0,0)'}
          barStyle={theme.dark ? 'default' : 'dark-content'}
        />
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.scroll}}}],
            {useNativeDriver: true},
          )}>
          <Backdrop
            video={videos.length > 0 ? videos[0] : null}
            scroll={this.scroll}
            path={mediaInfo.poster_path}
            shareId={`${section}.${type}.${mediaInfo.id}.poster`}
          />
          <Animatable.View
            animation={animation}
            delay={300}
            useNativeDriver
            style={[
              styles.content,
              {backgroundColor: theme.colors.background},
            ]}>
            <VideoMeta data={mediaInfo} type={type} section={section} />
            {!isReady ? (
              <HListSkeleton />
            ) : (
              <>
                <Credits
                  crew={credits.crew}
                  cast={credits.cast}
                  theme={theme}
                />
                <Images
                  images={images}
                  theme={theme}
                  navigation={this.props.navigation}
                />
                <Seasons
                  seasons={seasons.length > 0 ? seasons : null}
                  theme={theme}
                />
                <Recommendations
                  type={type}
                  loadMore={this.updateRecommendations}
                  recommendations={
                    recommendations.length > 0 ? recommendations : null
                  }
                  theme={theme}
                />
              </>
            )}
          </Animatable.View>
        </Animated.ScrollView>
        <Header
          scroll={this.scroll}
          theme={theme}
          headerTitle={mediaInfo.title ? mediaInfo.title : mediaInfo.name}
          navigation={this.props.navigation}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    marginTop: -HEIGHT * 0.4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: HEIGHT * 1.2,
  },
});

export default withTheme(VideoDetail);

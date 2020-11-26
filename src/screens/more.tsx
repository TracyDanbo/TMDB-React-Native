import {Theme} from '@react-navigation/native';
import React, {Component} from 'react';
import {Animated, StyleSheet, View, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import * as TMDB from '../API';
import {Video} from '../components/video';
import {HEADERHEIGHT, ITEM_WIDTH, STATUSHEIGHT} from '../constants';
import {configContext} from '../context';
import {withTheme} from '../HOC';
import type {
  MediaType,
  MoreScreenNavigationProp,
  MoreScreenRouteProp,
  SectionType,
  VideoType,
} from '../types';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface MoreProps {
  route: MoreScreenRouteProp;
  navigation: MoreScreenNavigationProp;
  theme: Theme;
}

interface MoreState {
  type: MediaType;
  data: VideoType[];
  section: SectionType;
  page: number;
  totalPage: number;
  isLoading: boolean;
  dvWidth: number;
  dvHeight: number;
  orientation: 'landscape' | 'portrait';
}

class More extends Component<MoreProps, MoreState> {
  static contextType = configContext;
  state: MoreState;
  _isMounted = false;
  source = axios.CancelToken.source();
  scroll = new Animated.Value(0);
  constructor(props: MoreProps) {
    super(props);
    const {width, height} = Dimensions.get('window');
    this.state = {
      type: props.route.params.type,
      data: [],
      section: props.route.params.section,
      page: 0,
      totalPage: 1,
      isLoading: false,
      dvWidth: width,
      dvHeight: height,
      orientation: width > height ? 'landscape' : 'portrait',
    };
    this.getOrientation = this.getOrientation.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }
  async componentDidMount() {
    Dimensions.addEventListener('change', this.getOrientation);
    this._isMounted = true;
    await this.onEndReached();
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.getOrientation);
    this.source.cancel('more: cancel request');
    this._isMounted = false;
  }
  getOrientation() {
    const {width, height} = Dimensions.get('window');
    if (width > height) {
      this.setState({
        orientation: 'landscape',
        dvWidth: width,
        dvHeight: height,
      });
    } else {
      this.setState({
        orientation: 'portrait',
        dvWidth: width,
        dvHeight: height,
      });
    }
  }

  renderItem({item}: {item: VideoType}) {
    const {theme} = this.props;
    const {type, section} = this.state;
    const imgUrl = TMDB.getImageBaseUrl(
      this.context,
      'poster',
      item.poster_path,
    );
    const source = imgUrl ? {uri: imgUrl} : null;
    const onPress = () => {
      this.props.navigation.push('videoDetail', {
        video: item,
        type: type,
        section: section,
        name: this.props.route.name,
      });
    };
    return (
      <Video
        video={item}
        onPress={onPress}
        color={theme.colors.text}
        source={source}
        type={type}
        section={section}
      />
    );
  }
  async onEndReached() {
    const {type, section, page, totalPage} = this.state;
    if (this.state.isLoading || page >= totalPage) {
      return;
    }
    this.setState({
      isLoading: true,
    });
    try {
      let res;
      if (section === 'trend') {
        res = await TMDB.getTrending(this.source, type, page + 1);
      } else if (section === 'topRated') {
        res = await TMDB.discovery(
          this.source,
          type,
          page + 1,
          'vote_average.desc',
        );
      } else if (section === 'popular') {
        res = await TMDB.discovery(
          this.source,
          type,
          page + 1,
          'popularity.desc',
        );
      } else if (section === 'nowPlaying') {
        res = await TMDB.nowPlaying(this.source, page + 1);
      } else if (section === 'onAir') {
        res = await TMDB.onAir(this.source, page + 1);
      }
      if (this._isMounted) {
        this.setState({
          data: this.state.data.concat(res?.data.results),
          page: res?.data.page,
          totalPage: res?.data.total_pages,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const {theme, navigation} = this.props;
    const {data, section, type, dvWidth} = this.state;
    const translateY = Animated.diffClamp(
      this.scroll,
      0,
      HEADERHEIGHT,
    ).interpolate({
      inputRange: [0, 1],
      outputRange: [0, -1],
    });
    const NUMCOLUMNS = Math.floor(dvWidth / ITEM_WIDTH);
    return (
      <View style={styles.container}>
        <Animated.FlatList
          key={dvWidth}
          contentContainerStyle={[
            styles.flist,
            {paddingHorizontal: (dvWidth - NUMCOLUMNS * ITEM_WIDTH) / 2},
          ]}
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={this.renderItem}
          numColumns={NUMCOLUMNS}
          onEndReached={this.onEndReached}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: this.scroll}}}],
            {useNativeDriver: true},
          )}
        />
        <Animated.View
          style={[
            styles.nav,
            {backgroundColor: theme.colors.background},
            {transform: [{translateY}]},
          ]}>
          <View style={styles.navheader}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="arrow-back" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.headerTitle,
                {color: theme.colors.text},
              ]}>{`${section} ${type}`}</Text>
          </View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flist: {
    paddingTop: HEADERHEIGHT + STATUSHEIGHT,
  },
  nav: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    paddingTop: STATUSHEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    // height: 60,
  },
  navheader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    textTransform: 'capitalize',
  },
  headerLeft: {
    position: 'absolute',
    left: 0,
    marginLeft: 10,
  },
});

export default withTheme(More);

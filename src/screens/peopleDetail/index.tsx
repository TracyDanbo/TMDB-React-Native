import {Theme} from '@react-navigation/native';
import React, {Component} from 'react';
import {StyleSheet, Animated, StatusBar, Dimensions} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import * as TMDB from '../../API';
import BottomSheet from '../../components/bottomSheet';
import PeopleMeta from './peopelMeta';
import {Header} from './header';
import {Video} from '../../components/video';
import {HEADERHEIGHT, HEIGHT, STATUSHEIGHT} from '../../constants';
import {configContext} from '../../context';
import {withTheme} from '../../HOC';
import type {
  CreditType,
  PeopelDetailScreenRouteProp,
  PeopleDetailScreenNavigationProp,
  VideoType,
} from '../../types';
import {Biography} from './biography';
import {KnowFor} from './knowFor';
import {Skeleton} from './skeleton';

interface PeopleDetailProps {
  route: PeopelDetailScreenRouteProp;
  navigation: PeopleDetailScreenNavigationProp;
  theme: Theme;
}

interface PeopleDetailState {
  mediaInfo: CreditType;
  credits: {
    cast: VideoType[];
    crew: VideoType[];
  };
  id: number;
  isLoaded: boolean;
  key: number;
}

class PeopleDetail extends Component<PeopleDetailProps, PeopleDetailState> {
  static contextType = configContext;
  state: PeopleDetailState;
  _isMounted = false;
  source = axios.CancelToken.source();
  translateYOffset = new Animated.Value((2 * HEIGHT) / 3);
  index = new Animated.Value(0);
  timer: NodeJS.Timeout | undefined;
  constructor(props: PeopleDetailProps) {
    super(props);
    this.state = {
      mediaInfo: this.props.route.params.people,
      credits: {
        cast: [],
        crew: [],
      },
      id: this.props.route.params.people.id,
      isLoaded: false,
      key: new Date().getTime(),
    };
    this.updateKey = this.updateKey.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.initLoad = this.initLoad.bind(this);
  }
  async componentDidMount() {
    Dimensions.addEventListener('change', this.updateKey);
    await this.initLoad();
  }

  componentWillUnmount() {
    this.source.cancel('people: cancel request');
    this._isMounted = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  updateKey() {
    const newKey = new Date().getTime();
    this.setState({
      key: newKey,
    });
  }

  async initLoad() {
    this._isMounted = true;
    try {
      const {
        data: {combined_credits, ...mediaInfo},
      } = await TMDB.getPeopleDetail(this.source, this.state.id);
      if (this._isMounted) {
        this.setState({
          mediaInfo,
          credits: {
            crew: this.obFilter(combined_credits.crew),
            cast: this.obFilter(combined_credits.cast),
          },
          isLoaded: true,
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

  renderItem({item, index}: {item: VideoType; index: number}) {
    const imgUrl = TMDB.getImageBaseUrl(
      this.context,
      'poster',
      item.poster_path,
    );
    const onPress = () => {
      Animated.spring(this.translateYOffset, {
        toValue: 0,
        useNativeDriver: true,
      }).start(); //open the modal
      this.index.setValue(index); // set the target item
    };
    const source = imgUrl ? {uri: imgUrl} : null;
    return (
      <Video
        video={item}
        source={source}
        color={this.props.theme.colors.text}
        onPress={onPress}
      />
    );
  }

  render() {
    const {theme, navigation} = this.props;
    const {mediaInfo, credits, isLoaded, key} = this.state;
    const {renderItem} = this;

    return (
      <SafeAreaView style={styles.screen} edges={['bottom', 'left', 'right']}>
        <StatusBar
          translucent={true}
          barStyle={theme.dark ? 'default' : 'dark-content'}
        />
        <ScrollView
          key={key}
          style={styles.sview}
          showsVerticalScrollIndicator={false}>
          <PeopleMeta data={mediaInfo} isLoaded={isLoaded} />

          {!isLoaded ? (
            <Skeleton />
          ) : (
            <>
              <Biography {...{mediaInfo, theme}} />
              <KnowFor {...{mediaInfo, theme, renderItem, credits}} />
            </>
          )}
        </ScrollView>
        <Header {...{navigation, theme}} />

        <BottomSheet
          dataList={
            mediaInfo.known_for_department === 'Acting'
              ? credits.cast
              : credits.crew
          }
          translateYOffset={this.translateYOffset}
          target={this.index}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  sview: {
    marginTop: HEADERHEIGHT + STATUSHEIGHT,
  },

  modal: {
    position: 'absolute',
    bottom: 0,
    transform: [{translateY: (2 * HEIGHT) / 3}],
  },
});

export default withTheme(PeopleDetail);

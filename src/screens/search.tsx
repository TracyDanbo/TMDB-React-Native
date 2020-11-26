import {Theme} from '@react-navigation/native';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Dimensions,
} from 'react-native';
import Animated, {multiply, diffClamp} from 'react-native-reanimated';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import * as TMDB from '../API';
import {configContext} from '../context';
import {Video} from '../components/video';
import {Credit} from '../components/credit';
import {withTheme} from '../HOC';
import {HEADERHEIGHT, ITEM_WIDTH, STATUSHEIGHT} from '../constants';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {
  CreditType,
  SearchScreenNavigationProp,
  SearchScreenRouteProp,
  VideoType,
} from '../types';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

interface SearchProps {
  route: SearchScreenRouteProp;
  navigation: SearchScreenNavigationProp;
  theme: Theme;
}

interface SearchState {
  // query: string;
  preQuery: string;
  data: (CreditType | VideoType)[];
  page: number;
  totalPage: number;
  isLoaded: boolean;
  dvWidth: number;
  dvHeight: number;
  orientation: 'landscape' | 'portrait';
}

class Search extends Component<SearchProps, SearchState> {
  static contextType = configContext;
  state: SearchState;
  _isMounted = false;
  source = axios.CancelToken.source();
  scroll = new Animated.Value(0);
  query = '';
  inputRef = React.createRef<TextInput>();
  constructor(props: SearchProps) {
    super(props);
    const {width, height} = Dimensions.get('window');
    this.state = {
      // query: '',
      preQuery: '',
      data: [],
      page: 0,
      totalPage: 1,
      isLoaded: true,
      dvWidth: width,
      dvHeight: height,
      orientation: width > height ? 'landscape' : 'portrait',
    };
    this.getOrientation = this.getOrientation.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }
  componentDidMount() {
    Dimensions.addEventListener('change', this.getOrientation);
    this._isMounted = true;
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.getOrientation);
    this.source.cancel('search: cancel request');
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
  onChange(text: string) {
    // this.setState({
    //   query: text,
    // });
    this.query = text;
  }
  async onSearch() {
    const {query} = this;
    const {preQuery, page, totalPage} = this.state;
    try {
      if (!query) {
        return;
      }
      if (query.trim() === preQuery && page >= totalPage) {
        return;
      }
      let prePage = page;
      if (query.trim() !== preQuery) {
        this.setState({
          preQuery: query.trim(),
          data: [],
          isLoaded: false,
        });
        prePage = 0;
      }
      if (this.inputRef.current) {
        this.inputRef.current.blur();
      }
      const {data} = await TMDB.multiSearch(this.source, query, prePage + 1);
      if (this._isMounted) {
        this.setState({
          data: this.state.data.concat(data.results),
          page: data.page,
          totalPage: data.total_pages,
          isLoaded: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async onEndReached() {
    const {preQuery, page} = this.state;
    try {
      const {data} = await TMDB.multiSearch(this.source, preQuery, page + 1);
      if (this._isMounted) {
        this.setState({
          data: this.state.data.concat(data.results),
          page: data.page,
          totalPage: data.total_pages,
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  renderItem({item}: {item: VideoType | CreditType}) {
    const {theme, route, navigation} = this.props;
    // const imgUrl = TMDB.getImageBaseUrl(
    //   this.context,
    //   item.media_type === 'person' ? 'profile' : 'poster',
    //   item.media_type === 'person'
    //     ? item.profile_path
    //     : (item as VideoType).poster_path,
    // );
    // const source = imgUrl ? {uri: imgUrl} : {};
    if (item.media_type === 'person') {
      const onPress = () => {
        navigation.push('peopleDetail', {people: item});
      };
      return (
        <Credit
          data={item as CreditType}
          onPress={onPress}
          // color={theme.colors.text}
          // source={source}
        />
      );
    } else {
      const onPress = () => {
        navigation.push('videoDetail', {
          video: item as VideoType,
          name: route.name,
          type: item.media_type,
          section: 'search',
        });
      };
      return (
        <Video
          video={item as VideoType}
          type={item.media_type}
          // source={source}
          section="search"
          key={route.key}
          color={theme.colors.text}
          onPress={onPress}
        />
      );
    }
  }

  render() {
    const {theme, navigation} = this.props;
    const {data, isLoaded, dvWidth} = this.state;
    const translateY = diffClamp(multiply(this.scroll, -1), -HEADERHEIGHT, 0);
    const NUMCOLUMNS = Math.floor(dvWidth / ITEM_WIDTH);
    return (
      <SafeAreaView style={styles.container}>
        {isLoaded ? (
          <AnimatedFlatList
            key={dvWidth}
            contentContainerStyle={[
              styles.flist,
              {paddingHorizontal: (dvWidth - NUMCOLUMNS * ITEM_WIDTH) / 2},
            ]}
            data={data}
            numColumns={NUMCOLUMNS}
            keyExtractor={(item: VideoType) => item.id.toString()}
            renderItem={this.renderItem}
            onEndReached={this.onEndReached}
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: this.scroll}}}],
              {useNativeDriver: true},
            )}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <ActivityIndicator size={'large'} color={theme.colors.text} />
        )}
        <Animated.View
          style={[
            styles.header,
            {backgroundColor: theme.colors.background},
            {transform: [{translateY}]},
          ]}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Icon
              style={[styles.icon]}
              name="arrow-back"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.searchHeader,
              {backgroundColor: theme.colors.border},
            ]}>
            <TextInput
              ref={this.inputRef}
              onChangeText={this.onChange}
              onSubmitEditing={this.onSearch}
              style={[styles.input, {color: theme.colors.text}]}
              disableFullscreenUI={true}
              returnKeyType={'search'}
              placeholder="Search..."
              placeholderTextColor={theme.colors.text}
              autoFocus
            />
            <TouchableOpacity onPress={this.onSearch}>
              <Icon
                style={styles.icon}
                name="search"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: HEADERHEIGHT + STATUSHEIGHT,
    paddingTop: STATUSHEIGHT + 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'rgba(0,0,0,0.05)',
    borderBottomWidth: 1,
  },

  searchHeader: {
    alignSelf: 'center',
    flex: 1,
    marginRight: 10,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'red',
  },
  icon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    marginRight: 20,
  },
  flist: {
    paddingTop: 80,
  },
});

export default withTheme(Search);

import 'react-native-gesture-handler';
import * as React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {ToastAndroid, useColorScheme} from 'react-native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import {enableScreens} from 'react-native-screens';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import VideoDetail from './src/screens/videoDetail';
import Home from './src/screens/home';
import More from './src/screens/more';
import Search from './src/screens/search';
import * as TMDB from './src/API';
import {GenreType, RootparamsList} from './src/types';
import {APIconfig, configContext, genreContext, GenreList} from './src/context';
import PeopleDetail from './src/screens/peopleDetail';
import Gallery from './src/screens/gallery';

enableScreens();
const Stack = createSharedElementStackNavigator<RootparamsList>();

export default function App() {
  const colorScheme = useColorScheme();
  const [config, setConfig] = React.useState(APIconfig);
  const [genreList, setGenreList] = React.useState(GenreList);
  const timer = React.useRef<NodeJS.Timeout>();
  React.useEffect(() => {
    const getConfig = async () => {
      try {
        const {data: _config} = await TMDB.getConfiguration();
        const {
          data: {genres: Moviegenre},
        } = await TMDB.getGenreList('movie');
        const {
          data: {genres: Tvgenre},
        } = await TMDB.getGenreList('tv');
        const M: {[id: string]: GenreType} = {};
        Moviegenre.forEach((item: GenreType) => {
          M[item.id] = item;
        });
        const T: {[id: string]: GenreType} = {};
        Tvgenre.forEach((item: GenreType) => {
          T[item.id] = item;
        });
        setConfig(_config);
        setGenreList({
          movie: M,
          tv: T,
        });
      } catch (error) {
        ToastAndroid.showWithGravity(
          error.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        if ((error.message = 'Network Error')) {
          if (timer.current) {
            clearTimeout(timer.current);
          }
          timer.current = setTimeout(() => {
            getConfig();
          }, 10000);
        }
      }
    };
    getConfig();
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <configContext.Provider value={config}>
          <genreContext.Provider value={genreList}>
            <Stack.Navigator
              // mode={'modal'}
              headerMode="screen"
              screenOptions={{
                headerShown: false,
                cardStyleInterpolator: ({current}) => ({
                  cardStyle: {
                    opacity: current.progress,
                  },
                }),
              }}>
              <Stack.Screen name="home" component={Home} />
              <Stack.Screen
                name="videoDetail"
                component={VideoDetail}
                sharedElements={(route, otherRoute) => {
                  const {video, section, type, name} = route.params;

                  if (otherRoute.name === 'home') {
                    return [{id: `${section}.${type}.${video.id}.poster`}];
                  }

                  if (otherRoute.name === name) {
                    return [{id: `${section}.${type}.${video.id}.poster`}];
                  }
                }}
              />
              <Stack.Screen
                name="peopleDetail"
                component={PeopleDetail}
                sharedElements={(route) => {
                  const {people} = route.params;
                  return [{id: `credits.${people.id}.profile`}];
                }}
              />
              <Stack.Screen name="more" component={More} />
              <Stack.Screen name="search" component={Search} />
              <Stack.Screen
                // options={{
                //   cardStyle: {backgroundColor: 'transparent'},
                // }}
                name="gallery"
                component={Gallery}
                sharedElements={(route) => {
                  const {images, index} = route.params;
                  return [{id: `${images[index].file_path}.img`}];
                }}
              />
            </Stack.Navigator>
          </genreContext.Provider>
        </configContext.Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

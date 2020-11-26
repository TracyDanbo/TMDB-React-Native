import {Theme} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {FlatList, TouchableNativeFeedback} from 'react-native-gesture-handler';
import {SharedImg} from '../../components/Img';
import {MediaImageType, VideoDetailScreenNavigationProp} from '../../types';

interface ImagesProps {
  images: MediaImageType[];
  theme: Theme;
  navigation: VideoDetailScreenNavigationProp;
}

const Images: React.FC<ImagesProps> = ({images, theme, navigation}) => {
  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <View key={index} style={styles.wraper}>
          <TouchableNativeFeedback
            onPress={() => navigation.push('gallery', {images, index})}>
            <SharedImg
              imgStyle={styles.img}
              path={item.file_path}
              imgType={'backdrop'}
              shareId={`${item.file_path}.img`}
              size={'w780'}
            />
          </TouchableNativeFeedback>
        </View>
      );
    },
    [images, navigation],
  );
  return (
    <>
      {images.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.header}>
            <Text style={[styles.title, {color: theme.colors.text}]}>
              Backdrops & Posters
            </Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              marginLeft: 10,
            }}
            data={images}
            keyExtractor={(item) => item.file_path}
            renderItem={renderItem}
          />
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    textTransform: 'capitalize',
    fontSize: 20,
    fontWeight: 'bold',
  },
  wraper: {
    marginRight: 5,
  },
  img: {
    height: 250,
    width: 280,
    resizeMode: 'cover',
    borderRadius: 20,
  },
});

export default Images;

import {useTheme} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {IMG_HEIGHT, IMG_WIDTH} from '../../constants';
import {CreditType} from '../../types';
import {SharedImg} from '../Img';

interface CreditProps {
  data: CreditType;
  onPress: () => void;
}

const areEqual = (preProps: CreditProps, nextProps: CreditProps) => {
  if (preProps.data.id === nextProps.data.id) {
    return true;
  }
  return false;
};

const Credit: React.FC<CreditProps> = React.memo(({data, onPress}) => {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <TouchableNativeFeedback onPress={onPress}>
        <SharedImg
          path={
            data.profile_path
              ? data.profile_path
              : require('../../assets/images/profile.png')
          }
          shareId={`credits.${data.id}.profile`}
          imgStyle={styles.img}
          imgType={'profile'}
        />
        <Text style={[styles.name, {color: theme.colors.text}]}>
          {data.name}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.character, {color: theme.colors.text}]}>
          {data.job || data.character}
        </Text>
      </TouchableNativeFeedback>
    </View>
  );
}, areEqual);

const styles = StyleSheet.create({
  container: {
    width: IMG_WIDTH,
    margin: 10,
    borderRadius: 10,
  },

  img: {
    width: IMG_WIDTH,
    height: IMG_HEIGHT,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
  },
  character: {
    fontSize: 12,
  },
});

export default Credit;

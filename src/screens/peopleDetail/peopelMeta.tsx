import {useTheme} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PROFILE_IMG_HEIGHT, PROFILE_IMG_WIDTH} from '../../constants';
import {TextSkeleton} from '../../components/skeleton';
import type {CreditType} from '../../types';
import {SharedImg} from '../../components/Img';

interface PeopleMetaProps {
  data: CreditType;
  isLoaded: boolean;
}

const PeopleMeta: React.FC<PeopleMetaProps> = ({data, isLoaded}) => {
  const {colors} = useTheme();
  //
  return (
    <View style={styles.container}>
      <SharedImg
        path={data.profile_path}
        shareId={`credits.${data.id}.profile`}
        imgStyle={styles.img}
        imgType={'profile'}
      />
      <View style={{flex: 1}}>
        <Text numberOfLines={2} style={[styles.name, {color: colors.text}]}>
          {data.name}
        </Text>
        {!isLoaded ? (
          <TextSkeleton />
        ) : (
          <View>
            {data.birthday ? (
              <Text style={[styles.other, {color: colors.text}]}>
                Born: {moment(data.birthday).format('MMM DD,yyyy')}
              </Text>
            ) : null}
            {data.place_of_birth ? (
              <Text style={[styles.other, {color: colors.text}]}>
                {data.place_of_birth}
              </Text>
            ) : null}

            {data.deathday ? (
              <Text style={[styles.other, {color: colors.text}]}>
                {data.deathday}
              </Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 20,
    // paddingTop: 30,
  },

  img: {
    width: PROFILE_IMG_WIDTH,
    height: PROFILE_IMG_HEIGHT,
    resizeMode: 'cover',
    borderRadius: 20,
    marginRight: 20,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  other: {
    fontSize: 16,
    paddingTop: 10,
  },
});

export default PeopleMeta;

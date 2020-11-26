import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {ITEM_WIDTH} from '../../constants';
import Credit from './credit';
import type {CreditType} from '../../types';

interface CreditListProps {
  casts: CreditType[];
  crews: CreditType[];
}

const CreditList: React.FC<CreditListProps> = ({casts, crews}) => {
  const navigation = useNavigation();
  const renderItem = useCallback(
    ({item}) => {
      const onPress = () => {
        navigation.navigate('peopleDetail', {people: item});
      };

      return <Credit data={item} onPress={onPress} />;
    },
    [navigation],
  );
  const getItemLayout = useCallback((_, index) => {
    return {
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    };
  }, []);
  return (
    <FlatList
      ListHeaderComponent={
        crews.length > 0 ? renderItem({item: crews[0]}) : null
      }
      data={casts}
      keyExtractor={(item: CreditType) => item.id.toString()}
      renderItem={renderItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      maxToRenderPerBatch={10}
      removeClippedSubviews={true}
      getItemLayout={getItemLayout}
    />
  );
};

export default CreditList;

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TextSkeleton, HListSkeleton} from '../../components/skeleton';

export const Skeleton: React.FC = () => {
  return (
    <>
      <View style={styles.section}>
        <TextSkeleton />
      </View>
      <View style={styles.section}>
        <HListSkeleton />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingBottom: 20,
  },
});

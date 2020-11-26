import {useTheme} from '@react-navigation/native';
import React from 'react';

export const withTheme = <P extends object>(
  Component: React.ComponentType<P>,
) => {
  return (props: P) => {
    const theme = useTheme();
    return <Component theme={theme} {...props} />;
  };
};

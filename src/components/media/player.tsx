import React from 'react';
import {View} from 'react-native';
import YouTube from 'react-native-youtube';
import {YOUTUBE_API} from '@env';

const Player: React.FC = () => {
  return <YouTube apikey={YOUTUBE_API} />;
};

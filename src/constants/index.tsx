import {Dimensions, StatusBar} from 'react-native';

export const {width: WIDTH, height: HEIGHT} = Dimensions.get('window');
export const STATUSHEIGHT = StatusBar.currentHeight
  ? StatusBar.currentHeight
  : 0;

export const HEADERHEIGHT = 60;
export const TABBARHEIGHT = 40;
export const IMG_WIDTH = 100;
export const ITEM_WIDTH = IMG_WIDTH + 20;
export const IMG_HEIGHT = IMG_WIDTH / 0.67;

export const CAROUSEL_IMG_WIDTH = WIDTH * 0.7;
export const CAROUSEL_IMG_HEIGHT = CAROUSEL_IMG_WIDTH * 1.5;
export const CAROUSEL_ITEM_WIDTH = CAROUSEL_IMG_WIDTH + 20;

export const PROFILE_IMG_WIDTH = 130;
export const PROFILE_IMG_HEIGHT = PROFILE_IMG_WIDTH / 0.67;

export const FULL_IMG_HEIGHT = HEIGHT;
export const FULL_IMG_WIDTH = FULL_IMG_HEIGHT * 0.67;

export const MODAL_ITME_WIDTH = WIDTH - 40;
export const MODAL_IMG_WIDTH = 130;
export const MODAL_IMG_HEIGHT = MODAL_IMG_WIDTH / 0.67;
export const tabs = ['movie', 'tv'];

export const NUMCOLUMNS = Math.floor(WIDTH / ITEM_WIDTH);
export const SNAP_POINTS_FROM_BOTTOM = [0, (HEIGHT * 2) / 3];
export const ENDPOINT = SNAP_POINTS_FROM_BOTTOM[1];
export const STARTPOINT = SNAP_POINTS_FROM_BOTTOM[0];

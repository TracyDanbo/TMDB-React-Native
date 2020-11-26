import React, {useContext} from 'react';
import {Image, ImageRequireSource, ImageStyle} from 'react-native';
import {SharedElement} from 'react-navigation-shared-element';
import {getImageBaseUrl} from '../../API';
import {configContext} from '../../context';
import {ImgType} from '../../types';

interface SharedImgProps {
  path: string | ImageRequireSource;
  shareId: string;
  imgStyle: ImageStyle | ImageStyle[];
  imgType: ImgType;
  size?: string;
}

export const SharedImg: React.FC<SharedImgProps> = React.memo(
  ({path, shareId, imgStyle, imgType, size}) => {
    const config = useContext(configContext);
    let source;
    if (typeof path === 'string') {
      const imgUrl = getImageBaseUrl(config, imgType, path, size);
      source = imgUrl ? {uri: imgUrl} : {};
    } else {
      source = path;
    }

    return (
      <SharedElement id={shareId}>
        <Image style={imgStyle} source={source} />
      </SharedElement>
    );
  },
);

interface ImgProps {
  path: string;
  imgStyle: ImageStyle | ImageStyle[];
  imgType: ImgType;
  size?: string;
}

export const Img: React.FC<ImgProps> = React.memo(
  ({path, imgStyle, imgType, size}) => {
    const config = useContext(configContext);
    let source;
    if (typeof path === 'string') {
      const imgUrl = getImageBaseUrl(config, imgType, path, size);
      source = imgUrl ? {uri: imgUrl} : {};
    } else {
      source = path;
    }
    return <Image style={imgStyle} source={source} />;
  },
);

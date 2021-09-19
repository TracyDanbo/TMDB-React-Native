import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export type RootparamsList = {
  home: undefined;
  videoDetail: {
    video: VideoType;
    section: SectionType;
    type: MediaType;
    name: string;
  };
  peopleDetail: {people: CreditType};
  more: {type: MediaType; section: SectionType};
  search: undefined;
  gallery: {images: MediaImageType[]; index: number};
};

export type TabparamsList = {
  movie: undefined;
  tv: undefined;
};

export type HomeScreenNavigationProp = StackNavigationProp<
  RootparamsList,
  'home'
>;

export type VideoDetailScreenNavigationProp = StackNavigationProp<
  RootparamsList,
  'videoDetail'
>;
export type PeopleDetailScreenNavigationProp = StackNavigationProp<
  RootparamsList,
  'peopleDetail'
>;

export type MoreScreenNavigationProp = StackNavigationProp<
  RootparamsList,
  'more'
>;

export type SearchScreenNavigationProp = StackNavigationProp<
  RootparamsList,
  'search'
>;
export type GalleryScreenNavigationProp = StackNavigationProp<
  RootparamsList,
  'gallery'
>;

export type HomeScreenRouteProp = RouteProp<RootparamsList, 'home'>;
export type VideoDetailScreenRouteProp = RouteProp<
  RootparamsList,
  'videoDetail'
>;
export type PeopelDetailScreenRouteProp = RouteProp<
  RootparamsList,
  'peopleDetail'
>;

export type MoreScreenRouteProp = RouteProp<RootparamsList, 'more'>;
export type SearchScreenRouteProp = RouteProp<RootparamsList, 'search'>;
export type GalleryScreenRouteProp = RouteProp<RootparamsList, 'gallery'>;

export type MediaType = 'tv' | 'movie' | 'peroson';
export type SectionType =
  | 'trend'
  | 'popular'
  | 'topRated'
  | 'Upcoming'
  | 'recommendations'
  | 'AiringToday'
  | 'nowPlaying'
  | 'onAir'
  | 'know_for'
  | 'search';
export type GenreType = {id: number; name: string};
export type ImgType = 'poster' | 'backdrop' | 'profile';
export interface configType {
  images: {
    base_url: string;
    backdrop_sizes: string[];
    poster_sizes: string[];
    profile_sizes: string[];
    logo_sizes: string[];
    still_sizes: string[];
    secure_base_url: string;
  };
  change_keys: string[];
}

export interface CreditType {
  id: number;
  name: string;
  character: string;
  job: string;
  profile_path: string;
  birthday: string;
  known_for_department: string;
  deathday: string | null;
  biography: string;
  place_of_birth: string;
  media_type: 'person';
}

export interface VideoType {
  id: number;
  poster_path: string;
  backdrop_path: string;
  title?: string;
  name?: string;
  original_language: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  last_air_date: string;
  number_of_seasons?: number;
  media_type: 'tv' | 'movie';
  genres?: GenreType[];
  episode_count: number;
  genre_ids: number[];
  runtime?: number;
  status: string;
}

export interface SeasonType {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: string;
}

export interface MediaVideoType {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
}

export interface MediaImageType {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

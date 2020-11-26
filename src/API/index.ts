import {ImgType, MediaType} from './../types/index';
import axios, {CancelTokenSource} from 'axios';
import {THEMOVIEDB_API} from '@env';
import {configType} from '../types';
const TMDB = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    Authorization: `Bearer ${THEMOVIEDB_API}`,
    'Content-Type': 'application/json;charset=utf-8',
  },
});

export function getConfiguration() {
  return TMDB.get('configuration');
}

export function getGenreList(type: 'movie' | 'tv') {
  return TMDB.get(`/genre/${type}/list`);
}

export function getImageBaseUrl(
  config: configType,
  type: ImgType,
  path: string,
  size?: string,
  // original?: boolean,
) {
  if (!path) {
    return null;
  }
  if (!config.images.secure_base_url) {
    return null;
  }
  const baseUrl = config.images.secure_base_url;
  const poster_size = size ? size : config.images.poster_sizes[4];
  const profile_size = size ? size : config.images.profile_sizes[1];
  const backdrop_size = size ? size : config.images.backdrop_sizes[2];

  if (type === 'poster') {
    return `${baseUrl}${poster_size}${path}`;
  } else if (type === 'profile') {
    return `${baseUrl}${profile_size}${path}`;
  } else {
    return `${baseUrl}${backdrop_size}${path}`;
  }
}

export function getVideoDetail(
  source: CancelTokenSource,
  id: number,
  type: MediaType,
  // language: string = 'en-US',
) {
  return TMDB.get(`${type}/${id}`, {
    cancelToken: source.token,
    params: {
      // language,
      append_to_response: 'credits,recommendations,videos,images',
    },
  });
}

export function getVideoRecommendations(
  source: CancelTokenSource,
  type: MediaType,
  videoId: number,
  page: number = 1,
  language: string = 'en-US',
) {
  return TMDB.get(`${type}/${videoId}/recommendations`, {
    cancelToken: source.token,
    params: {page, language},
  });
}

export function getTrending(
  source: CancelTokenSource,
  type: MediaType = 'tv',
  page: number = 1,
  timeWindow: string = 'week',
) {
  return TMDB.get(`/trending/${type}/${timeWindow}`, {
    cancelToken: source.token,
    params: {page},
  });
}

export function getPeopleDetail(
  source: CancelTokenSource,
  id: number,
  language: string = 'en-US',
) {
  return TMDB.get(`/person/${id}`, {
    cancelToken: source.token,
    params: {
      language,
      append_to_response: 'combined_credits',
    },
  });
}

export function getUpcomingMoives(
  source: CancelTokenSource,
  page: number = 1,
  language: string = 'en-US',
  region: string = 'US',
) {
  return TMDB.get('/movie/upcoming', {
    cancelToken: source.token,
    params: {page, language, region},
  });
}

export function discovery(
  source: CancelTokenSource,
  type: MediaType = 'movie',
  page: number = 1,
  sort_by:
    | 'popularity.desc'
    | 'popularity.asc'
    | 'vote_average.desc'
    | 'vote_average.asc' = 'popularity.desc',
  language: string = 'en-US',
  region: string = 'US',
) {
  return TMDB.get(`/discover/${type}`, {
    cancelToken: source.token,
    params: {page, language, region, sort_by},
  });
}

export function nowPlaying(
  source: CancelTokenSource,
  page: number = 1,
  language: string = 'en-US',
) {
  return TMDB.get('/movie/now_playing', {
    cancelToken: source.token,
    params: {page, language},
  });
}

export function onAir(
  source: CancelTokenSource,
  page: number = 1,
  language: string = 'en-US',
  region: string = 'en',
) {
  return TMDB.get('/tv/on_the_air', {
    cancelToken: source.token,
    params: {page, language, region},
  });
}

export function multiSearch(
  source: CancelTokenSource,
  query: string,
  page: number = 1,
  region: string = 'US',
  language: string = 'en-US',
) {
  return TMDB.get('/search/multi', {
    cancelToken: source.token,
    params: {query, page, region, language},
  });
}

export function getTvAiringToday(
  source: CancelTokenSource,
  page: number = 1,
  language: string = 'en-US',
) {
  return TMDB.get('/tv/airing_today', {
    cancelToken: source.token,
    params: {page, language},
  });
}

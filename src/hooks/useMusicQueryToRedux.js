import { useQuery } from '@tanstack/react-query';
import { getPlaylistByIdQueryOptions } from '../queries/playlists';
import { getAlbumByIdQueryOptions } from '../queries/albums';
import { getSongByIdQueryOptions } from '../queries/musics';
import { useEffect } from 'react';
import useQueryState from './useQueryState';
import { useDispatch } from 'react-redux';
import {
  setSelectedCollection,
  setSelectedCollectionTracks,
} from '../redux/slices/playContextSlice';
import { setSingleSong } from '../redux/slices/playContextSlice';
import { setCurrentSongIndex } from '../redux/slices/musicPlayerSlice';
import { getRelatedSongsBySongDataQueryOptions } from '../queries/musics';

const queryOptions = {
  playlist: getPlaylistByIdQueryOptions,
  album: getAlbumByIdQueryOptions,
  track: getSongByIdQueryOptions,
};

const actions = {
  playlist: setSelectedCollection,
  album: setSelectedCollection,
  track: setSingleSong,
};

// Custom hook to fetch music data based on query strings
// and store it in Redux as the initial state after page load
export default function useMusicQueryToRedux() {
  const dispatch = useDispatch();
  const { getQuery } = useQueryState();
  const queryType = getQuery('type');
  const id = getQuery('id');

  // Fetch initial media data (playlist, album, or single track)
  const { data } = useQuery({
    ...queryOptions[queryType]?.(id),
    enabled: !!queryOptions[queryType],
  });

  // If the media is a single track, fetch related songs
  const { data: relatedSongs } = useQuery({
    ...getRelatedSongsBySongDataQueryOptions(data),
    enabled: !!data?.id && queryType === 'track',
  });

  useEffect(() => {
    if (data) {
      const action = actions[queryType];
      dispatch(action(data));

      // For single tracks, also save related songs and play the song.
      if (queryType === 'track') {
        relatedSongs && dispatch(setSelectedCollectionTracks(relatedSongs));
        dispatch(setCurrentSongIndex(0));
      }
    }
  }, [data, dispatch, queryType, relatedSongs]);
}


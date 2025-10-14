import { useQuery } from '@tanstack/react-query';
import { getPlaylistByIdQueryOptions } from '../queries/playlists';
import { getAlbumByIdQueryOptions } from '../queries/albums';
import { getSongByIdQueryOptions } from '../queries/musics';
import { useEffect, useRef } from 'react';
import useQueryState from './useQueryState';
import { useDispatch } from 'react-redux';
import {
  setSelectedCollection,
  setSelectedCollectionTracks,
} from '../redux/slices/playContextSlice';
import { setSingleSong } from '../redux/slices/playContextSlice';
import { pause, setCurrentSongIndex } from '../redux/slices/musicPlayerSlice';
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

const dummyQueryOptions = {
  queryKey: ['dummy'],
  queryFn: () => {},
};

// Custom hook to fetch music data based on query strings
// and store it in Redux as the initial state after page load
export default function useMusicQueryToRedux() {
  const dispatch = useDispatch();
  const { getQuery } = useQueryState();
  const queryType = getQuery('type');
  const id = getQuery('id');
  const isInitialPageLoad = useRef(true);

  // Fetch initial media data (playlist, album, or single track)
  const { data } = useQuery({
    // set dummy query option if query type is not found to avoid react query error
    ...(queryOptions[queryType]?.(id) || dummyQueryOptions),
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
        // dont play the song if this is the initial page load.
        if (isInitialPageLoad.current && relatedSongs) {
          dispatch(pause());
          isInitialPageLoad.current = false;
        }
      }
    }
  }, [data, dispatch, queryType, relatedSongs]);
}

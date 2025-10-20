import { useQuery } from '@tanstack/react-query';
import { getPlaylistByIdQueryOptions } from '../queries/playlists';
import { getAlbumByIdQueryOptions } from '../queries/albums';
import { getSongByIdQueryOptions } from '../queries/musics';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setSelectedCollection,
  setSelectedCollectionTracks,
} from '../redux/slices/playContextSlice';
import { setSingleSong } from '../redux/slices/playContextSlice';
import { setCurrentMusic, music } from '../redux/slices/musicPlayerSlice';
import { getRelatedSongsBySongDataQueryOptions } from '../queries/musics';
import { useSelector } from 'react-redux';

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
  const queryType = useSelector(state => state.queryState.type);
  const id = useSelector(state => state.queryState.id);
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);

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

      // For single tracks, also save related songs and play the song. also dont play the song on initial page load (if current music dose not exist). on initial load it is better to user him self play the song.
      // thats why we're manipulating music.src and currentMusic directly instead of dispatching setCurrentSongIndex
      if (queryType === 'track' && relatedSongs && !currentMusic) {
        dispatch(setSelectedCollectionTracks(relatedSongs));
        music.src = data.song_url;
        dispatch(setCurrentMusic(data));
      }
    }
  }, [data, dispatch, queryType, relatedSongs, currentMusic]);
}

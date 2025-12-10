import { useEffect, useRef } from 'react';
import { setQueries } from '../redux/slices/queryStateSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSongByIdQueryOptions } from '../queries/musics';
import { setCurrentQueuelist, setSelectedSong } from '../redux/slices/playContextSlice';
import { pause, setCurrentSongIndex } from '../redux/slices/musicPlayerSlice';

// Syncs the Redux query state with the current URL search parameters.
// Whenever the URL changes (e.g. ?type=album&id=123), this hook extracts
// the updated query params and stores them in Redux so the UI and music playback can react accordingly.

export default function useUrlListener() {
  const mediaId = useSelector((state) => state.queryState.id);
  const mediaType = useSelector((state) => state.queryState.type);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigationType = useNavigationType();
  const { data: track } = useQuery({
    ...getSongByIdQueryOptions(mediaId),
    enabled: mediaType === 'track' && !!mediaId,
  });
  const locationKey = useRef(location.key);
  // Determines whether we should automatically start playback when the user navigates
  // through browser history (Back/Forward).
  // In this case, the previously visited track should resume playing automatically.
  const shouldAutoplayTrackOnHistoryNavigation =
    navigationType === 'POP' &&
    mediaType === 'track' &&
    track &&
    location.key !== locationKey.current; // prevent autoplay on initial page load

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queries = Object.fromEntries(params.entries());
    dispatch(setQueries(queries));

    // stop the playback if there is no search params
    if (!location.search) {
      dispatch(pause());
      dispatch(setCurrentQueuelist([]));
      dispatch(setSelectedSong({}));
      return;
    }

    if (shouldAutoplayTrackOnHistoryNavigation) {
      dispatch(setCurrentQueuelist([track]));
      dispatch(setCurrentSongIndex(0));
      dispatch(setSelectedSong(track));
    }
  }, [location.search, dispatch, track, shouldAutoplayTrackOnHistoryNavigation]);
}

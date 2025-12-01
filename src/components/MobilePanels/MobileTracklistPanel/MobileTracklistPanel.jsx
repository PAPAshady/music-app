import IconButton from '../../Buttons/IconButton/IconButton';
import MainButton from '../../Buttons/MainButton/MainButton';
import useMediaQuery from '../../../hooks/useMediaQuery';
import { useQuery } from '@tanstack/react-query';
import playlistDefaultCover from '../../../assets/images/covers/no-cover.jpg';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentSongIndex, play, pause } from '../../../redux/slices/musicPlayerSlice';
import { setCurrentCollection } from '../../../redux/slices/playContextSlice';
import { togglePlayState } from '../../../redux/slices/musicPlayerSlice';
import { getFavoriteSongsQueryOptions } from '../../../queries/musics';
import { Play, Pause, Shuffle, RepeateOne, RepeateMusic } from 'iconsax-react';
import {
  getSongsByAlbumIdQueryOptions,
  getSongsByPlaylistIdQueryOptions,
} from '../../../queries/musics';
import { getAlbumByIdQueryOptions } from '../../../queries/albums';
import { getPlaylistByIdQueryOptions } from '../../../queries/playlists';
import { favoriteSongsInfos } from '../../../redux/slices/playContextSlice';
import AddSongPanel from './AddSongPanel';
import MobileTracklistPanelSongsList from './MobileTracklistPanelSongsList';
import MobileTracklistPanelPlayButtons from './MobileTracklistPanelPlayButtons';

function MobileTracklistPanel() {
  const tracklistType = useSelector((state) => state.queryState.type);
  const tracklistId = useSelector((state) => state.queryState.id);
  const dispatch = useDispatch();
  const [pendingSongId, setPendingSongId] = useState(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const { data } = useQuery(
    tracklistType === 'album'
      ? getAlbumByIdQueryOptions(tracklistId)
      : getPlaylistByIdQueryOptions(tracklistId)
  );
  const isMobilePanelOpen = useSelector((state) => state.mobilePanel.isMobilePanelOpen);
  const isTablet = useMediaQuery('(min-width: 768px)');
  const playingState = useSelector((state) => state.musicPlayer.playingState);
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const playingTracklist = useSelector((state) => state.playContext.currentCollection);
  const { data: selectedPlaylistSongs, isLoading: isPlaylistSongsLoading } = useQuery(
    tracklistType === 'playlist'
      ? getSongsByPlaylistIdQueryOptions(tracklistId)
      : tracklistType === 'album'
        ? getSongsByAlbumIdQueryOptions(tracklistId)
        : getFavoriteSongsQueryOptions()
  );

  // Build a list of suggested songs by excluding any songs that already exist in the selected playlist
  const selectedTracklist = tracklistType === 'favorites' ? favoriteSongsInfos : data;
  const isFavorites = selectedTracklist?.tracklistType === 'favorites';
  const showAddSongPanel =
    isMobilePanelOpen &&
    !selectedTracklist?.is_public &&
    selectedTracklist?.tracklistType !== 'favorites';
  const showPlayButtons =
    !selectedTracklist?.is_public && selectedTracklist?.tracklistType !== 'album' && !isFavorites;

  const playPauseButtonHandler = () => {
    if (playingTracklist.id !== selectedTracklist?.id) {
      dispatch(setCurrentCollection(selectedTracklist));
      dispatch(setCurrentSongIndex(0));
    } else {
      dispatch(isPlaying ? pause() : play());
    }
  };

  return (
    <>
      {/* Playback buttons */}
      <div className="mt-3 flex w-full items-center justify-between gap-2 lg:px-8">
        <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
          <button className="border-primary-200 h-10 w-8 rounded-sm border p-[2px] sm:h-12 sm:w-9">
            <img
              src={selectedTracklist?.cover ?? playlistDefaultCover}
              className="size-full rounded-sm object-cover"
            />
          </button>
          {showPlayButtons && (
            <MobileTracklistPanelPlayButtons
              tracklistTitle={selectedTracklist?.title}
              setIsAddMenuOpen={setIsAddMenuOpen}
            />
          )}
        </div>
        <div className="flex items-center gap-3.5 sm:gap-5 md:gap-7">
          <IconButton
            icon={
              playingState === 'shuffle' ? (
                <Shuffle />
              ) : playingState === 'repeat_one' ? (
                <RepeateOne />
              ) : (
                <RepeateMusic />
              )
            }
            classNames="sm:size-9 md:size-10"
            onClick={() => dispatch(togglePlayState())}
          />
          <MainButton
            classNames="size-12 sm:size-14 md:size-20 !rounded-full flex justify-center items-center"
            title={
              isPlaying && playingTracklist.id === selectedTracklist?.id ? (
                <Pause size={isTablet ? 32 : 24} />
              ) : (
                <Play size={isTablet ? 32 : 24} />
              )
            }
            onClick={playPauseButtonHandler}
            disabled={!selectedPlaylistSongs?.length}
          />
        </div>
      </div>

      <MobileTracklistPanelSongsList
        selectedTracklist={selectedTracklist}
        tracklistId={tracklistId}
        isSongsPending={isPlaylistSongsLoading}
        songs={selectedPlaylistSongs}
        setPendingSongId={setPendingSongId}
        pendingSongId={pendingSongId}
      />

      {showAddSongPanel && (
        <AddSongPanel
          isOpen={isAddMenuOpen}
          setIsOpen={setIsAddMenuOpen}
          selectedPlaylistSongs={selectedPlaylistSongs}
          pendingSongId={pendingSongId}
          setPendingSongId={setPendingSongId}
        />
      )}
    </>
  );
}

export default MobileTracklistPanel;

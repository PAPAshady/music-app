import SongCardSkeleton from '../MusicCards/SongCard/SongCardSkeleton';
import SongCard from '../MusicCards/SongCard/SongCard';
import { Musicnote } from 'iconsax-reactjs';
import usePlayBar from '../../hooks/usePlayBar';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { closeMobileSearchPanel } from '../../redux/slices/mobileSearchPanelSlice';
import PropTypes from 'prop-types';
import MobileSearchPanelSectionTitle from './MobileSearchPanelSectionTitle';

function MobileSearchPanelSongsList({ songs, isSongsPending }) {
  const dispatch = useDispatch();
  const { playSingleSong } = usePlayBar();

  const onPlayTrack = useCallback(
    (song) => {
      playSingleSong(song);
      dispatch(closeMobileSearchPanel());
    },
    [dispatch, playSingleSong]
  );

  return (
    <div>
      <MobileSearchPanelSectionTitle title="Songs" icon={<Musicnote />} />
      <div className="grid grid-cols-1 gap-3 px-1 min-[992px]:!grid-cols-3 sm:grid-cols-2">
        {isSongsPending
          ? Array(4)
              .fill()
              .map((_, index) => <SongCardSkeleton key={index} />)
          : songs.map((song, index) => (
              <SongCard key={song.id} song={song} index={index} onPlay={onPlayTrack} />
            ))}
      </div>
    </div>
  );
}

MobileSearchPanelSongsList.propTypes = {
  songs: PropTypes.array,
  isSongsPending: PropTypes.bool.isRequired,
};

export default MobileSearchPanelSongsList;

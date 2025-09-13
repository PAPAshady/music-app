import { memo } from 'react';
import PropTypes from 'prop-types';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import addPlaylistImg from '../../../assets/images/covers/add-playlist.jpg';
import { Heart, Play, AddCircle } from 'iconsax-react';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import { setSidebarPanelType } from '../../../redux/slices/sidebarTypeSlice';
import { setSelectedCollection } from '../../../redux/slices/playContextSlice';

const PlaylistCard = memo(({ isAddPlaylistButton, ...playlist }) => {
  const dispatch = useDispatch();
  const { title, totaltracks, cover, isFavorite, classNames } = playlist;
  const playlistCover = cover ? cover : noCoverImg;

  const showSelectedPlaylist = () => {
    dispatch(setSelectedCollection(playlist));
    dispatch(openMobilePanel({ type: 'tracklist', title }));
    dispatch(setSidebarPanelType('tracklist_panel'));
  };

  // if 'isAddPlaylistButton' is true render a button that adds playlist. This button is only being rendered on the playlists page to add a new playlist.
  if (isAddPlaylistButton) {
    return (
      <button
        onClick={() =>
          dispatch(openModal({ title: 'Create new playlist.', actionType: 'create_playlist' }))
        }
        className={`h-36 w-full overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat shadow-[0_8px_16px_2px] shadow-[black]/25 lg:h-48 ${classNames}`}
        style={{ backgroundImage: `url(${addPlaylistImg})` }}
      >
        <div className="flex size-full flex-col items-center justify-center gap-2 bg-[black]/35 p-2 lg:gap-3">
          <span className="size-12 lg:size-15">
            <AddCircle size="100%" />
          </span>
          <p className="text-primary-50 text-lg font-semibold lg:text-xl">Add New Playlist</p>
        </div>
      </button>
    );
  }

  return (
    <div
      className={`group relative flex h-36 min-w-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat shadow-[2px_2px_15px_rgba(0,0,0,0.5)] outline outline-transparent transition-all duration-300 hover:outline-white lg:h-48 lg:min-w-[152px] lg:outline-none xl:min-w-[140px] ${classNames}`}
      style={{ backgroundImage: `url(${playlistCover})` }}
      title={title}
      onClick={showSelectedPlaylist}
    >
      <div className="flex size-full flex-col justify-between bg-gradient-to-t from-[rgba(0,0,0,.7)] to-transparent p-2">
        <div className="p-1 text-end">
          <button className="size-6 lg:size-[26px]">
            <Heart
              size="100%"
              className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>
        </div>

        <div className="text-white-50 hidden items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 lg:flex">
          <button>
            <Play size={32} />
          </button>
        </div>

        <div>
          <h3 className="text-white-50 mb-1 cursor-pointer truncate text-base">{title}</h3>
          <p className="text-sm text-white">
            {totaltracks ? `${totaltracks} ${totaltracks > 1 ? 'tracks' : 'track'}` : 'No tracks'}
          </p>
        </div>
      </div>
    </div>
  );
});
PlaylistCard.propTypes = {
  isAddPlaylistButton: PropTypes.bool,
  title: PropTypes.string,
  totaltracks: PropTypes.number,
  cover: PropTypes.string,
  isFavorite: PropTypes.bool,
  classNames: PropTypes.string,
};

PlaylistCard.displayName = 'PlaylistCard';

export default PlaylistCard;

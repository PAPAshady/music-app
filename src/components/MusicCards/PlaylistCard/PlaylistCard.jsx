import { memo } from 'react';
import PropTypes from 'prop-types';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import addPlaylistImg from '../../../assets/images/covers/add-playlist.jpg';
import { Heart, Play, AddCircle } from 'iconsax-react';
import usePlaylistInfosModal from '../../../hooks/usePlaylistInfosModal';

const PlaylistCard = memo(
  ({ isAddPlaylistButton, title, numberOfTracks, image = noCoverImg, isFavorite, classNames }) => {
    const { setIsOpen, setModalTitle } = usePlaylistInfosModal();

    const openEditPlaylistModal = () => {
      setModalTitle('Add new playlist');
      setIsOpen(true);
    };

    // if 'isAddPlaylistButton' is true render a button that adds playlist. This button is only being rendered on the playlists page to add a new playlist.
    if (isAddPlaylistButton) {
      return (
        <button
          onClick={openEditPlaylistModal}
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
        className={`group relative flex h-36 min-w-36 items-center justify-center overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat shadow-[2px_2px_15px_rgba(0,0,0,0.5)] outline outline-transparent transition-all duration-300 hover:outline-white lg:h-48 lg:min-w-[152px] lg:outline-none xl:min-w-[140px] ${classNames}`}
        style={{ backgroundImage: `url(${image})` }}
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
            <p className="text-sm text-white">{numberOfTracks} Tracks</p>
          </div>
        </div>
      </div>
    );
  }
);
PlaylistCard.propTypes = {
  isAddPlaylistButton: PropTypes.bool,
  title: PropTypes.string,
  numberOfTracks: PropTypes.number,
  image: PropTypes.string,
  isFavorite: PropTypes.bool,
  classNames: PropTypes.string,
};

PlaylistCard.displayName = 'PlaylistCard';

export default PlaylistCard;

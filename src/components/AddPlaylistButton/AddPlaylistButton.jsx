import addPlaylistImg from '../../assets/images/covers/add-playlist.jpg';
import { useDispatch } from 'react-redux';
import { openModal } from '../../redux/slices/playlistInfosModalSlice';
import { AddCircle } from 'iconsax-react';
import PropTypes from 'prop-types';

function AddPlaylistButton({ classNames }) {
  const dispatch = useDispatch();
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

AddPlaylistButton.propTypes = {
  classNames: PropTypes.string,
};

export default AddPlaylistButton;

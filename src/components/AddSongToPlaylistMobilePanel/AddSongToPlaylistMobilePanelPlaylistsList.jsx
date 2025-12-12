import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Add } from 'iconsax-reactjs';
import { openModal as openPlaylistInfosModal } from '../../redux/slices/playlistInfosModalSlice';
import Playlist from './Playlist';

function AddSongToPlaylistMobilePanelPlaylistsList({ playlists, isPending }) {
  return (
    <div className="mt-3 grow space-y-1 overflow-y-auto px-1 pb-4 md:px-6">
      {isPending ? (
        <div className="grid size-full place-content-center">
          <div className="size-10">
            <LoadingSpinner size="md" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-2 min-[560px]:grid-cols-2">
            <CreatePlaylistButton />
            {playlists.map((playlist) => (
              <Playlist key={playlist.id} {...playlist} />
            ))}
          </div>
          {playlists.length === 0 && (
            <div className="mb-6 space-y-2 pt-3 text-center">
              <p className="text-xl font-bold">No results found</p>
              <p className="text-secondary-100 text-sm">
                Check the spelling, or try different keywords.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CreatePlaylistButton() {
  const dispatch = useDispatch();

  return (
    <button
      className="flex w-full cursor-pointer items-center rounded-md p-1 min-[560px]:border min-[560px]:border-slate-600 md:p-1.5"
      onClick={() =>
        dispatch(
          openPlaylistInfosModal({
            title: 'Create new playlist',
            actionType: 'create_playlist',
          })
        )
      }
    >
      <div className="flex items-center gap-2">
        <div className="grid size-14 place-content-center rounded-md bg-slate-700 md:size-16">
          <Add size={42} />
        </div>
        <div>
          <p className="font-semibold">New playlist</p>
        </div>
      </div>
    </button>
  );
}

export default AddSongToPlaylistMobilePanelPlaylistsList;

AddSongToPlaylistMobilePanelPlaylistsList.propTypes = {
  playlists: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
};

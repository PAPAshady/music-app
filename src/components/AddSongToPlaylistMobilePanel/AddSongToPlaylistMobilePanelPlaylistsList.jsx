import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import defaultCover from '../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';
import { AddCircle, Add } from 'iconsax-react';

function AddSongToPlaylistMobilePanelPlaylistsList({ playlists, isPending }) {
  return (
    <div className="mt-3 grow space-y-1 overflow-y-auto px-1 pb-4">
      {isPending ? (
        <div className="grid size-full place-content-center">
          <div className="size-10">
            <LoadingSpinner size="md" />
          </div>
        </div>
      ) : (
        <>
          {playlists.length > 0 ? (
            playlists.map((playlist) => <Playlist key={playlist.id} {...playlist} />)
          ) : (
            <div className="mb-6 space-y-2 pt-3 text-center">
              <p className="text-xl font-bold">No results found</p>
              <p className="text-secondary-100 text-sm">
                Check the spelling, or try different keywords.
              </p>
            </div>
          )}
          <div className="flex w-full cursor-pointer items-center rounded-md p-1">
            <div className="flex items-center gap-2">
              <div className="grid size-11 place-content-center rounded-md bg-slate-700">
                <Add size={36} />
              </div>
              <div>
                <p className="font-semibold">New playlist</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AddSongToPlaylistMobilePanelPlaylistsList;

function Playlist({ cover, title, totaltracks }) {
  return (
    <div className="flex w-full cursor-pointer items-center rounded-md p-1">
      <div className="flex grow items-center gap-2">
        <img src={cover || defaultCover} className="size-11 rounded-md object-cover" />
        <div>
          <p className="font-semibold">{title}</p>
          <span className="text-secondary-200 text-sm">
            {totaltracks ? `${totaltracks} song${totaltracks > 1 ? 's' : ''}` : 'Empty'}
          </span>
        </div>
      </div>
      <button>
        <AddCircle />
      </button>
    </div>
  );
}

Playlist.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  totaltracks: PropTypes.number,
};

AddSongToPlaylistMobilePanelPlaylistsList.propTypes = {
  playlists: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
};

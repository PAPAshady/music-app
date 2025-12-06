import { createPortal } from 'react-dom';
import { forwardRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { SearchNormal1, Add } from 'iconsax-react';
import { useQuery } from '@tanstack/react-query';
import { getAllPrivatePlaylistsQueryOptions } from '../../../queries/playlists';
import PlaylistItem from './PlaylistItem';
import PlaylistItemSkeleton from './PlaylistItemSkeleton';
import useInput from '../../../hooks/useInput';
import { openModal as openPlaylistInfosModal } from '../../../redux/slices/playlistInfosModalSlice';

const PlayBarDropDownMenu = forwardRef((_, ref) => {
  const dispatch = useDispatch();
  const position = useSelector((state) => state.addSongToPlaylist.position);
  const { data, isPending } = useQuery(getAllPrivatePlaylistsQueryOptions());
  const searchInput = useInput();
  const playlists = data?.filter((playlist) =>
    playlist.title.toLowerCase().includes(searchInput.value.trim().toLowerCase())
  );
  const noPlaylistsFound = playlists?.length === 0 && searchInput.value.trim();
  const noPlaylistsExist = data?.length === 0;

  return createPortal(
    <div
      className={`text-secondary-50 border-secondary-300 absolute z-[5] flex w-[250px] flex-col rounded-md border bg-gradient-to-b from-slate-700 to-slate-900 p-2`}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      ref={ref}
    >
      <div className="mb-1 border-b border-slate-700 pb-2">
        <div className="flex items-center rounded-md bg-slate-600">
          <div className="ps-2">
            <SearchNormal1 size={20} />
          </div>
          <input
            type="text"
            placeholder="Find a playlist"
            className="placeholder:text-secondary-50 p-1.5 text-sm outline-none"
            value={searchInput.value}
            onChange={searchInput.onChange}
          />
        </div>
        <button
          className="mt-1 flex w-full items-center gap-2 rounded-sm py-1.5 hover:bg-slate-700"
          onClick={() =>
            dispatch(
              openPlaylistInfosModal({
                actionType: 'create_playlist',
                title: 'Create new playlist',
              })
            )
          }
        >
          <div>
            <Add />
          </div>
          <span className="text-sm">New playlist</span>
        </button>
      </div>
      <div className="max-h-[250px] min-h-[180px] grow space-y-2 overflow-y-auto py-2 pe-1.5">
        {isPending ? (
          Array(4)
            .fill()
            .map((_, index) => <PlaylistItemSkeleton key={index} />)
        ) : noPlaylistsExist ? (
          <div className="pt-2 text-center">
            <p className="mb-2 text-lg font-bold">You have no playlist</p>
            <p className="text-secondary-100 text-sm">
              Create playlists to easily organize your favorite songs.
            </p>
          </div>
        ) : noPlaylistsFound ? (
          <div className="pt-2 text-center">
            <p className="mb-2 text-lg font-bold">No results found</p>
            <p className="text-secondary-100 text-sm">
              Check the spelling, or try different keywords.
            </p>
          </div>
        ) : (
          playlists.map((playlist) => <PlaylistItem key={playlist.id} {...playlist} />)
        )}
      </div>
    </div>,
    document.getElementById('addSongToPlaylistDropDown')
  );
});

PlayBarDropDownMenu.displayName = 'PlayBarDropDownMenu';

export default PlayBarDropDownMenu;

import SongCard from '../../MusicCards/SongCard/SongCard';
import SongCardSkeleton from '../../MusicCards/SongCard/SongCardSkeleton';
import { Music } from 'iconsax-reactjs';
import usePlayBar from '../../../hooks/usePlayBar';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import {
  getGeneratedQueuelistBySongDataQueryOptions,
  getFavoriteSongsQueryOptions,
  getSongsByPlaylistIdQueryOptions,
  getSongsByAlbumIdQueryOptions,
  getPopularSongsByArtistIdQueryOptions,
} from '../../../queries/songs';

function QueuelistTab() {
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);
  const { playTracklist } = usePlayBar();
  const type = useSelector((state) => state.queryState.type);
  const playingTracklist = useSelector((state) => state.playContext.currentCollection);
  const selectedSong = useSelector((state) => state.playContext.selectedSong);
  const { data: songs, isPending: isSongsPending } = useQuery(
    type === 'track'
      ? getGeneratedQueuelistBySongDataQueryOptions(selectedSong)
      : type === 'playlist'
        ? getSongsByPlaylistIdQueryOptions(playingTracklist.id)
        : type === 'album'
          ? getSongsByAlbumIdQueryOptions(playingTracklist.id)
          : type === 'artist'
            ? getPopularSongsByArtistIdQueryOptions(currentMusic?.artist_id)
            : getFavoriteSongsQueryOptions()
  );

  return (
    <div className="flex flex-col gap-2">
      {isSongsPending ? (
        Array(10)
          .fill()
          .map((_, index) => <SongCardSkeleton key={index} />)
      ) : songs?.length ? (
        songs?.map((music, index) => (
          <SongCard
            key={music.id}
            song={music}
            onPlay={playTracklist}
            index={index}
            // highlight current playing song in the queuelist.
            classNames={`!border-none !text-white  ${music.id === currentMusic?.id ? '!bg-slate-700' : ''}`}
          />
        ))
      ) : (
        <div className="mt-10 flex size-full flex-col items-center justify-center gap-2 rounded-md border-neutral-400 text-center">
          <Music size={68} className="text-secondary-300" />
          <p className="mt-2 text-xl font-semibold text-white">There is no song in the queue</p>
          <p>Let the music begin...</p>
        </div>
      )}
    </div>
  );
}

export default QueuelistTab;

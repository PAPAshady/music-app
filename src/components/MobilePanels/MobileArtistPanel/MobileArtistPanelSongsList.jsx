import useMediaQuery from '../../../hooks/useMediaQuery';
import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import usePlayBar from '../../../hooks/usePlayBar';
import PropTypes from 'prop-types';

function MobileArtistPanelSongsList({ songs, isPending, artistId }) {
  const isLargeMobile = useMediaQuery('(min-width: 420px)');
  const { playArtistSongs } = usePlayBar(artistId);
  return (
    <div>
      <p className="px-4 py-4 text-center text-2xl font-bold">Popular</p>

      {isPending ? (
        <div className="mt-8 flex w-full grow flex-col items-center gap-3 sm:gap-4 md:gap-5 md:pb-4">
          {Array(5)
            .fill()
            .map((_, index) => (
              <PlayBarSkeleton
                key={index}
                size={isLargeMobile ? 'lg' : 'md'}
                classNames="!w-full text-start !max-w-none"
              />
            ))}
        </div>
      ) : songs.length ? (
        <div className="mt-8 flex w-full grow flex-col items-center gap-3 sm:gap-4 md:gap-5 md:pb-4">
          {songs.map((song, index) => (
            <PlayBar
              key={song.id}
              size={isLargeMobile ? 'lg' : 'md'}
              index={index}
              classNames="!w-full text-start !max-w-none"
              song={song}
              onPlay={playArtistSongs}
            />
          ))}
        </div>
      ) : (
        <div className="my-2 w-full">
          <p className="text-gray-400 md:text-lg">No tracks from this artist.</p>
        </div>
      )}
    </div>
  );
}

MobileArtistPanelSongsList.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
  artistId: PropTypes.string,
};

export default MobileArtistPanelSongsList;

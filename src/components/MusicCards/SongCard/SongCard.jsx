import { formatTime } from '../../../redux/slices/musicPlayerSlice';
import PropTypes from 'prop-types';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';

function Song({ song, index: songIndex, onPlay }) {
  const { cover, title, artist, duration } = song;
  return (
    <div
      className="flex cursor-pointer gap-3 rounded-md border p-2 hover:bg-white/3"
      onClick={() => onPlay(song, songIndex)}
    >
      <img
        src={cover || defaultSongCover}
        alt="cover"
        className="h-12 w-12 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col justify-center gap-1 overflow-hidden">
        <p className="truncate text-sm font-medium" title={title}>
          {title}
        </p>
        <p className="truncate text-xs text-slate-300" title={artist}>
          {artist}
        </p>
      </div>
      <div className="text-sm text-slate-400">{formatTime(duration)}</div>
    </div>
  );
}
Song.propTypes = {
  song: PropTypes.object,
  index: PropTypes.number,
  onPlay: PropTypes.func,
};

export default Song;

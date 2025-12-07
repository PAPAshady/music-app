import { formatTime } from '../../../redux/slices/musicPlayerSlice';
import PropTypes from 'prop-types';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';

function Song({ song, index: songIndex, onPlay, classNames }) {
  const { cover, title, artist, duration } = song;
  return (
    <div
      className={`flex cursor-pointer gap-3 rounded-md border p-2 hover:bg-white/30 ${classNames}`}
      onClick={() => onPlay(song, songIndex)}
    >
      <img
        src={cover || defaultSongCover}
        alt="cover"
        className="size-14 rounded-md object-cover"
      />
      <div className="flex flex-1 flex-col justify-center gap-1 overflow-hidden">
        <p className="truncate  font-medium" title={title}>
          {title}
        </p>
        <p className="truncate text-sm text-slate-300" title={artist}>
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
  classNames: PropTypes.string,
};

export default Song;

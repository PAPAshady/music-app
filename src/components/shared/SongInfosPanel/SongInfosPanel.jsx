import PropTypes from 'prop-types';
import { useState } from 'react';
import { Play, Pause, Heart, Menu } from 'iconsax-react';
import { useSelector } from 'react-redux';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';
import defaultArtistCover from '../../../assets/images/Avatar/no-avatar.png';
import { useQuery } from '@tanstack/react-query';
import { getArtistByIdQueryOptions } from '../../../queries/artists';
import { getPopularSongsByArtistIdQueryOptions } from '../../../queries/musics';
import { Music } from 'iconsax-react';
import {
  formatTime,
  play,
  pause,
  setCurrentSongIndex,
} from '../../../redux/slices/musicPlayerSlice';
import { useDispatch } from 'react-redux';
import { setPlayingContext } from '../../../redux/slices/playContextSlice';

const MOCK_RELATED = [
  { id: 'r1', title: 'In the Air', artist: 'Aeris', cover: 'https://picsum.photos/60/60?random=1' },
  {
    id: 'r2',
    title: 'Love Like This',
    artist: 'Zachary Johnson',
    cover: 'https://picsum.photos/60/60?random=2',
  },
  {
    id: 'r3',
    title: 'Give Me Love',
    artist: 'Sally',
    cover: 'https://picsum.photos/60/60?random=3',
  },
  {
    id: 'r4',
    title: 'Endless',
    artist: 'The Natives',
    cover: 'https://picsum.photos/60/60?random=4',
  },
  { id: 'r5', title: 'Another Day', artist: 'Kaya', cover: 'https://picsum.photos/60/60?random=5' },
];

function IconButton({ children, label, onClick, className = '', title }) {
  return (
    <button
      aria-label={label}
      title={title || label}
      onClick={onClick}
      className={
        'flex items-center justify-center rounded-lg p-2 transition hover:bg-white/6 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:outline-none ' +
        className
      }
    >
      {children}
    </button>
  );
}

function TabButton({ active, onClick, children, id }) {
  return (
    <button
      id={id}
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-md px-4 py-2 text-sm font-medium transition ${
        active ? 'bg-white/8 text-white' : 'text-slate-300 hover:bg-white/2'
      }`}
    >
      {children}
    </button>
  );
}

export default function SongSidebar() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('lyrics');
  const [isLiked, setIsLiked] = useState(false);
  const related = MOCK_RELATED;
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const queueList = useSelector((state) => state.playContext.selectedContextQueueList);
  const selectedSong = useSelector((state) => state.playContext.selectedContext);
  const playingSong = useSelector((state) => state.playContext.playingContext);
  const song = queueList[0];
  const { data: artist } = useQuery(getArtistByIdQueryOptions(song.artist_id));
  const { data: popularSongs } = useQuery(getPopularSongsByArtistIdQueryOptions(song.artist_id));
  const isPlayingSongSelected = selectedSong.id === playingSong.id;

  const playPauseButtonHandler = () => {
    if (isPlayingSongSelected) {
      dispatch(isPlaying ? pause() : play());
    } else {
      dispatch(setPlayingContext(selectedSong));
      dispatch(setCurrentSongIndex(0));
    }
  };

  return (
    <div className="sticky top-10 hidden xl:block">
      <aside
        className={`border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col overflow-y-hidden rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 p-5 px-3 py-5 pb-3 text-white shadow-2xl xl:w-[310px] 2xl:h-[calc(100dvh-200px)]`}
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src={song.cover || defaultSongCover}
            alt={`${song.title} cover`}
            className="h-20 w-20 rounded-md object-cover shadow-md"
          />
          <div className="flex-1">
            <h3 className="line-clamp-2 text-[22px] leading-tight font-semibold">{song.title}</h3>
            <button
              className="mt-1 text-sm text-slate-300 hover:underline"
              onClick={() => setActiveTab('artist')}
            >
              {song.artist}
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <IconButton
            onClick={playPauseButtonHandler}
            label={isPlayingSongSelected ? (isPlaying ? 'Pause' : 'Play') : 'Play'}
            className="bg-white/6"
          >
            {isPlayingSongSelected ? (
              isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )
            ) : (
              <Play size={20} />
            )}
          </IconButton>
          <IconButton label={isLiked ? 'Unlike' : 'Like'} onClick={() => setIsLiked((v) => !v)}>
            <Heart
              size={20}
              className={`transition-colors ${isLiked ? 'fill-white text-white' : 'fill-transparent text-white'}`}
            />
          </IconButton>

          <IconButton label="More">
            <Menu size={20} />
          </IconButton>

          <div className="ml-auto text-sm text-slate-400">
            {formatTime(song.duration)} • {song.release_date?.split('-')[0]}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-5">
          <div role="tablist" aria-label="Song panels" className="flex gap-2">
            <TabButton
              id="tab-lyrics"
              active={activeTab === 'lyrics'}
              onClick={() => setActiveTab('lyrics')}
            >
              Lyrics
            </TabButton>
            <TabButton
              id="tab-related"
              active={activeTab === 'related'}
              onClick={() => setActiveTab('related')}
            >
              Related
            </TabButton>
            <TabButton
              id="tab-artist"
              active={activeTab === 'artist'}
              onClick={() => setActiveTab('artist')}
            >
              Artist
            </TabButton>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'lyrics' && (
          <>
            <div className="my-4 flex items-center justify-between">
              <div className="text-sm text-slate-300">Lyrics</div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input type="checkbox" className="accent-indigo-400" />
                  Auto
                </label>
              </div>
            </div>
            <div className="flex-1 overflow-auto pr-2 pb-2">
              {song.lyrics ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {(song.lyrics || []).map((line, idx) => (
                      <p key={idx} className="text-lg leading-7 text-slate-300">
                        {line || '\u00A0'}
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 text-center">
                  <Music size={55} className="text-secondary-300" />
                  <p className="mt-2 px-4 font-semibold text-white">
                    No lyrics available at the moment.
                  </p>
                  <p className="text-sm">Check back soon!</p>
                </div>
              )}
            </div>
          </>
        )}
        {activeTab === 'related' && (
          <div className="my-4 flex-1 space-y-4 overflow-auto pr-2 pb-2">
            <div className="text-sm text-slate-300">Suggested & Queue</div>
            <ul className="mt-2 space-y-3">
              {related.map((item) => (
                <li
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-white/3"
                  onClick={() => console.log('play related', item)}
                >
                  <img src={item.cover} alt="cover" className="h-12 w-12 rounded-md object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm text-slate-300">{item.artist}</div>
                  </div>
                  <div className="text-sm text-slate-400">3:12</div>
                </li>
              ))}
            </ul>
            <button className="mt-3 w-full rounded-md bg-white/6 py-2 text-sm">Show more</button>
          </div>
        )}
        {activeTab === 'artist' && (
          <div className="my-4 flex-1 space-y-4 overflow-auto pr-2 pb-2">
            <div className="flex items-center gap-3">
              <img
                src={artist?.image || defaultArtistCover}
                alt={artist?.name}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <div className="text-lg font-semibold">{artist?.name}</div>
                <div className="text-sm text-slate-300">Artist</div>
              </div>
            </div>

            <p className="text-sm text-slate-300">{artist?.bio}</p>

            <div>
              <div className="mb-2 text-sm text-slate-300">Top tracks</div>
              <ul className="space-y-2">
                {popularSongs?.map((song) => (
                  <li
                    key={song.id}
                    className="ts-center flex cursor-pointer gap-3 rounded-md p-2 hover:bg-white/3"
                    onClick={() => console.log('play related', song)}
                  >
                    <img
                      src={song.cover || defaultSongCover}
                      alt="cover"
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-medium" title={song.title}>
                        {song.title}
                      </div>
                      <div className="text-sm text-slate-300">{song.artist}</div>
                    </div>
                    <div className="text-sm text-slate-400">3:12</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer actions (optional) */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => console.log('add to playlist')}
            className="flex-1 rounded-md bg-white/6 py-2 text-sm hover:bg-white/8"
          >
            Add to playlist
          </button>
        </div>
      </aside>
    </div>
  );
}

IconButton.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
};

TabButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  id: PropTypes.string,
};

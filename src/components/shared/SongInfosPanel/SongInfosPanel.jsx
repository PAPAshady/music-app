import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';
import defaultArtistCover from '../../../assets/images/Avatar/no-avatar.png';
import { useQuery } from '@tanstack/react-query';
import { getArtistByIdQueryOptions } from '../../../queries/artists';
import { getPopularSongsByArtistIdQueryOptions } from '../../../queries/musics';

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
  const [activeTab, setActiveTab] = useState('lyrics');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const contentRef = useRef(null);
  const related = MOCK_RELATED;
  const queueList = useSelector((state) => state.playContext.selectedContextQueueList);
  const selectedSong = queueList[0];
  const { data: artist } = useQuery(getArtistByIdQueryOptions(selectedSong.artist_id));
  const { data: popularSongs } = useQuery(
    getPopularSongsByArtistIdQueryOptions(selectedSong.artist_id)
  );

  useEffect(() => {
    // reset when song changes
    setActiveTab('lyrics');
    setIsPlaying(false);
  }, [selectedSong.id]);

  return (
    <div className="sticky top-10 hidden xl:block">
      <aside
        className={`border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col overflow-y-hidden rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 p-5 px-3 py-5 pb-3 text-white shadow-2xl xl:w-[310px] 2xl:h-[calc(100dvh-200px)]`}
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <img
            src={selectedSong.cover || defaultSongCover}
            alt={`${selectedSong.title} cover`}
            className="h-20 w-20 rounded-md object-cover shadow-md"
          />
          <div className="flex-1">
            <h3 className="line-clamp-2 text-[22px] leading-tight font-semibold">
              {selectedSong.title}
            </h3>
            <button
              className="mt-1 text-sm text-slate-300 hover:underline"
              onClick={() => setActiveTab('artist')}
            >
              {selectedSong.artist}
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <IconButton
            label={isPlaying ? 'Pause' : 'Play'}
            onClick={() => setIsPlaying((prev) => !prev)}
            className="bg-white/6"
          >
            {isPlaying ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3v18l15-9L5 3z" />
              </svg>
            )}
          </IconButton>
          <IconButton label={isLiked ? 'Unlike' : 'Like'} onClick={() => setIsLiked((v) => !v)}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21s-7-4.35-9-7.05C1.33 11.8 3 7 7 6c2.3-.66 3.55 1 5 2 1.45-1 2.7-2.66 5-2 4 1 5.67 5.8 4 7.95C19 16.65 12 21 12 21z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isLiked ? 'rgba(255,255,255,0.95)' : 'none'}
              />
            </svg>
          </IconButton>

          <IconButton label="More">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="5" cy="12" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
              <circle cx="19" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </IconButton>

          <div className="ml-auto text-sm text-slate-400">
            {selectedSong.duration} • {selectedSong.release_date?.split('-')[0]}
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
            <div ref={contentRef} className="flex-1 overflow-auto pr-2 pb-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  {(selectedSong.lyrics || []).map((line, idx) => (
                    <p key={idx} className="text-lg leading-7 text-slate-300">
                      {line || '\u00A0'}
                    </p>
                  ))}
                </div>
              </div>
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

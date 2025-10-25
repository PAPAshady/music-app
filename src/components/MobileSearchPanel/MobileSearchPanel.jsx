import { createPortal } from 'react-dom';
import SearchInput from '../Inputs/SearchInput/SearchInput';
import useInput from '../../hooks/useInput';
import { useQuery } from '@tanstack/react-query';
import SongCardSkeleton from '../MusicCards/SongCard/SongCardSkeleton';
import SongCard from '../MusicCards/SongCard/SongCard';
import { Musicnote, Profile2User, MusicPlaylist, Music, ArrowLeft } from 'iconsax-react';
import AlbumCard from '../MusicCards/AlbumCard/AlbumCard';
import AlbumCardSkeleton from '../MusicCards/AlbumCard/AlbumCardSkeleton';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { globalSearchQueryOptions } from '../../queries/globalSearch';
import useDebounce from '../../hooks/useDebounce';
import { useSelector, useDispatch } from 'react-redux';
import { closeMobileSearchPanel } from '../../redux/slices/mobileSearchPanelSlice';
import SmallArtistCard from '../MusicCards/SmallArtistCard/SmallArtistCard';
import SmallArtistCardSkeleton from '../MusicCards/SmallArtistCard/SmallArtistCardSkeleton';
import usePlayBar from '../../hooks/usePlayBar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import PlaylistCard from '../MusicCards/PlaylistCard/PlaylistCard';
import PlaylistCardSkeleton from '../MusicCards/PlaylistCard/PlaylistCardSkeleton';

export default function MobileSearchPanel() {
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState('all');
  const searchInput = useInput();
  const query = useDebounce(searchInput.value, 500);
  const { data, isPending } = useQuery(globalSearchQueryOptions(query.trim(), activeFilter));
  const isOpen = useSelector((state) => state.mobileSearchPanel.isOpen);
  const hasData = Object.entries(data ?? {}).some((data) => data[1].length);
  const { playSingleSong } = usePlayBar();
  const inputRef = useRef(null);

  const onPlayTrack = useCallback(
    (song) => {
      playSingleSong(song);
      dispatch(closeMobileSearchPanel());
    },
    [dispatch, playSingleSong]
  );

  const filterButtons = [
    { id: 1, text: 'all' },
    { id: 2, text: 'songs' },
    { id: 3, text: 'artists' },
    { id: 4, text: 'albums' },
    { id: 5, text: 'playlists' },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      inputRef.current.focus();
    } else document.body.style.overflow = 'visible';

    return () => (document.body.style.overflow = 'visible');
  }, [isOpen]);

  return createPortal(
    <div
      className={`text-secondary-50 fixed inset-0 z-10 bg-gradient-to-b from-slate-800 to-slate-700 transition ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
    >
      <div className="container flex h-full flex-col py-2">
        <div className="flex grow flex-col gap-4 overflow-y-auto pb-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <button onClick={() => dispatch(closeMobileSearchPanel())}>
                <ArrowLeft />
              </button>
              <div className="grow">
                <SearchInput {...searchInput} ref={inputRef} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
              {filterButtons.map((button) => (
                <FilterButton
                  key={button.id}
                  {...button}
                  isActive={button.text === activeFilter}
                  onClick={setActiveFilter}
                />
              ))}
            </div>
          </div>
          {searchInput.value.trim() ? (
            !isPending && !hasData ? (
              <div className="mt-4 flex grow flex-col items-center justify-center gap-3 rounded-md px-8 text-center">
                <Music size={72} />
                <p className="max-w-[500px] text-2xl font-semibold">
                  Couldn&apos;t find anyting. Try searching for something else.
                </p>
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-10">
                {(isPending || !!data.songs?.length) && (
                  <div>
                    <SectionTitle title="Songs" icon={<Musicnote />} />
                    <div className="grid grid-cols-1 gap-3 px-1 min-[992px]:!grid-cols-3 sm:grid-cols-2">
                      {isPending
                        ? Array(4)
                            .fill()
                            .map((_, index) => <SongCardSkeleton key={index} />)
                        : data.songs.map((song, index) => (
                            <SongCard
                              key={song.id}
                              song={song}
                              index={index}
                              onPlay={onPlayTrack}
                            />
                          ))}
                    </div>
                  </div>
                )}
                {(isPending || !!data.albums?.length) && (
                  <div>
                    <SectionTitle title="Albums" icon={<MusicPlaylist />} />
                    <div className="grid grid-cols-1 gap-3 px-1 sm:grid-cols-2">
                      {isPending
                        ? Array(4)
                            .fill()
                            .map((_, index) => <AlbumCardSkeleton key={index} size="md" />)
                        : data.albums.map((album) => (
                            <AlbumCard
                              size="md"
                              key={album.id}
                              album={album}
                              classNames="!max-w-none"
                            />
                          ))}
                    </div>
                  </div>
                )}
                {(isPending || !!data.artists?.length) && (
                  <div>
                    <SectionTitle title="Artists" icon={<Profile2User />} />
                    <div className="grid grid-cols-3 gap-4 px-1 min-[500px]:grid-cols-4 min-[900px]:!grid-cols-6 sm:grid-cols-5">
                      {isPending
                        ? Array(6)
                            .fill()
                            .map((_, index) => <SmallArtistCardSkeleton key={index} size="md" />)
                        : data?.artists.map((artist) => (
                            <SmallArtistCard size="md" key={artist.id} artist={artist} />
                          ))}
                    </div>
                  </div>
                )}
                {(isPending || !!data.playlists?.length) && (
                  <div>
                    <SectionTitle title="Playlists" icon={<MusicPlaylist />} />
                    <Swiper
                      spaceBetween={20}
                      slidesPerView="auto"
                      modules={[Pagination]}
                      pagination={{ clickable: true }}
                      className="!m-0 !max-w-full !p-[1px]"
                    >
                      {isPending
                        ? Array(8)
                            .fill()
                            .map((_, index) => (
                              <SwiperSlide key={index} className="!w-auto !pb-11">
                                <PlaylistCardSkeleton classNames="!h-48" />
                              </SwiperSlide>
                            ))
                        : data.playlists.map((playlist) => (
                            <SwiperSlide key={playlist.id} className="!w-auto !pb-11">
                              <PlaylistCard {...playlist} classNames="!h-48" />
                            </SwiperSlide>
                          ))}
                    </Swiper>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="mt-4 flex grow flex-col items-center justify-center gap-3 rounded-md px-8 text-center">
              <Music size={72} />
              <p className="text-2xl font-semibold">Let the music begin</p>
              <p className="text-">You can now start searching for your tunes!</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.getElementById('mobileSearchPanel')
  );
}

function FilterButton({ text, isActive, onClick }) {
  return (
    <button
      className={`text-secondary-100 cursor-pointer rounded-full border border-transparent bg-slate-600 px-2 py-1.5 text-sm capitalize transition-colors hover:border-slate-500 ${isActive && 'outline-1'}`}
      onClick={() => onClick(text)}
    >
      {text}
    </button>
  );
}

function SectionTitle({ title, icon }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <p className="text-2xl font-bold">{title}</p>
    </div>
  );
}

FilterButton.propTypes = {
  text: PropTypes.string.isRequired,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

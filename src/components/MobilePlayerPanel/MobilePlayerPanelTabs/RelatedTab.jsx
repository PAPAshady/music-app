import { Swiper, SwiperSlide } from 'swiper/react';
import { chunkArray } from '../../../utils/arrayUtils';
import SmallArtistCard from '../../MusicCards/SmallArtistCard/SmallArtistCard';
import SmallArtistCardSkeleton from '../../MusicCards/SmallArtistCard/SmallArtistCardSkeleton';
import MobilePlayerPanelAlbumCard from '../MobilePlayerPanelAlbumCard/MobilePlayerPanelAlbumCard';
import MobilePlayerPanelAlbumCardSkeleton from '../MobilePlayerPanelAlbumCard/MobilePlayerPanelAlbumCardSkeleton';
import { getRelatedSongsBySongDataQueryOptions } from '../../../queries/musics';
import { getRelatedArtistsQueryOptions } from '../../../queries/artists';
import { getArtistByIdQueryOptions } from '../../../queries/artists';
import { getAlbumsByArtistIdQueryOptions } from '../../../queries/albums';
import usePlayBar from '../../../hooks/usePlayBar';
import { useQuery } from '@tanstack/react-query';
import { formatTime } from '../../../redux/slices/musicPlayerSlice';
import PropTypes from 'prop-types';
import SongCardSkeleton from '../../MusicCards/SongCard/SongCardSkeleton';
import SongCard from '../../MusicCards/SongCard/SongCard';

function RelatedTab({ onClose, song }) {
  const { data: relatedSongs, isPending: isRelatedSongsPending } = useQuery(
    getRelatedSongsBySongDataQueryOptions(song)
  );
  const { data: artist } = useQuery(getArtistByIdQueryOptions(song?.artist_id));
  const { data: relatedArtists, isPending: isRelatedArtistsPending } = useQuery(
    getRelatedArtistsQueryOptions(artist)
  );
  const { data: albums, isPending: isAlbumsPending } = useQuery(
    getAlbumsByArtistIdQueryOptions(song?.artist_id)
  );
  const { playSingleSong } = usePlayBar();

  return (
    <>
      <h2 className="mb-3 text-xl font-bold">You might also like</h2>
      <Swiper spaceBetween={16} slidesPerView={1.15}>
        {isRelatedSongsPending
          ? chunkArray(Array(12).fill(), 4).map((skeletonCardsArray, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col gap-4">
                  {skeletonCardsArray.map((_, index) => (
                    <SongCardSkeleton key={index} />
                  ))}
                </div>
              </SwiperSlide>
            ))
          : chunkArray(relatedSongs || [], 4).map((songsArray, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col gap-2">
                  {songsArray.map((song) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      onPlay={playSingleSong}
                      classNames="!border-none !text-white"
                    />
                  ))}
                </div>
              </SwiperSlide>
            ))}
      </Swiper>

      {/* Similar artists */}
      <h2 className="mt-6 mb-4 text-xl font-bold">Similar artists</h2>
      <Swiper slidesPerView={2.5}>
        {isRelatedArtistsPending
          ? Array(6)
              .fill()
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <SmallArtistCardSkeleton key={index} />
                </SwiperSlide>
              ))
          : relatedArtists.map((artist) => (
              <SwiperSlide key={artist.id}>
                <SmallArtistCard
                  artist={artist}
                  size="md"
                  onClick={onClose} // close player panel before opening artist panel
                />
              </SwiperSlide>
            ))}
      </Swiper>

      <h2 className="mt-6 mb-4 text-xl font-bold">More from this artist</h2>
      <Swiper spaceBetween={12} slidesPerView={2.3}>
        {isAlbumsPending
          ? Array(6)
              .fill()
              .map((_, index) => (
                <SwiperSlide key={index}>
                  <MobilePlayerPanelAlbumCardSkeleton />
                </SwiperSlide>
              ))
          : albums.map((album, i) => (
              <SwiperSlide key={i}>
                <MobilePlayerPanelAlbumCard album={album} onClick={onClose} />
              </SwiperSlide>
            ))}
      </Swiper>

      <h2 className="mt-6 mb-4 text-xl font-bold">Song details</h2>
      <div className="flex items-center gap-3">
        <div className="size-24 overflow-hidden rounded-xl">
          <img src={song?.cover} alt={song?.title} className="size-full object-cover" />
        </div>
        <div className="flex grow flex-col gap-1">
          <p className="font-bold">{song?.title}</p>
          <p className="text-sm text-slate-300">
            {song?.artist} - {formatTime(song?.duration)}
          </p>
          <p className="text-sm">
            {song?.album} - {song?.release_date.split('-')[0]}
          </p>
        </div>
      </div>
    </>
  );
}

RelatedTab.propTypes = {
  onClose: PropTypes.func.isRequired,
  song: PropTypes.object,
};

export default RelatedTab;

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { chunkArray } from '../../../../utils/arrayUtils';
import SmallArtistCard from '../../../MusicCards/SmallArtistCard/SmallArtistCard';
import SmallArtistCardSkeleton from '../../../MusicCards/SmallArtistCard/SmallArtistCardSkeleton';
import SmallAlbumCard from '../../../MusicCards/SmallAlbumCard/SmallAlbumCard';
import SmallAlbumCardSkeleton from '../../../MusicCards/SmallAlbumCard/SmallAlbumCardSkeleton';
import { getRelatedArtistsQueryOptions } from '../../../../queries/artists';
import { getRelatedSongsBySongDataQueryOptions } from '../../../../queries/musics';
import { getAlbumsByArtistIdQueryOptions } from '../../../../queries/albums';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import SongCardSkeleton from '../../../MusicCards/SongCard/SongCardSkeleton';
import SongCard from '../../../MusicCards/SongCard/SongCard';
import PropTypes from 'prop-types';

function RelatedTab({ song, artist }) {
  const { data: relatedSongs, isPending: isRelatedSongsPending } = useQuery(
    getRelatedSongsBySongDataQueryOptions(song)
  );

  const { data: similarArtists, isPending: isSimilarArtistsPending } = useQuery(
    getRelatedArtistsQueryOptions(artist)
  );
  const { data: albums, isPending: isAlbumsPending } = useQuery(
    getAlbumsByArtistIdQueryOptions(song?.artist_id, { limit: 3 })
  );
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={song?.id}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, y: 15 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 15 },
          transition: { duration: 0.6 },
        }}
        className="mt-4 h-full space-y-4 overflow-auto pr-2 pb-2"
      >
        <div>
          <div className="mb-4 font-semibold text-slate-300">You might also like</div>

          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1.15}
            spaceBetween={8}
          >
            {isRelatedSongsPending
              ? chunkArray(Array(9).fill(0), 3).map((skeletonCardsArray, index) => (
                  <SwiperSlide key={index} className="mb-11">
                    <div className="space-y-4">
                      {skeletonCardsArray.map((_, index) => (
                        <SongCardSkeleton key={index} />
                      ))}
                    </div>
                  </SwiperSlide>
                ))
              : chunkArray(relatedSongs, 3).map((songsArr, chunkIndex) => (
                  <SwiperSlide key={chunkIndex} className="mb-11">
                    <div className="space-y-4">
                      {songsArr.map((song, index) => (
                        <SongCard key={song.id} song={song} index={chunkIndex * 3 + index} />
                      ))}
                    </div>
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
        <div>
          <div className="mb-4 font-semibold text-slate-300">Similar artists</div>

          <Swiper modules={[Pagination]} pagination={{ clickable: true }} slidesPerView={2.3}>
            {isSimilarArtistsPending
              ? Array(4)
                  .fill()
                  .map((_, index) => (
                    <SwiperSlide key={index} className="mb-10">
                      <SmallArtistCardSkeleton key={index} size="md" />
                    </SwiperSlide>
                  ))
              : similarArtists.map((artist) => (
                  <SwiperSlide
                    key={artist.id}
                    className={`p-[1px] ${similarArtists.length > 2 ? 'mb-10' : 'mb-4'}`}
                  >
                    <SmallArtistCard artist={artist} size="md" />
                  </SwiperSlide>
                ))}
          </Swiper>
        </div>
        <div>
          <div className="mb-4 font-semibold text-slate-300">More from this artist</div>
          <div className="space-y-1">
            {isAlbumsPending
              ? Array(3)
                  .fill()
                  .map((_, index) => <SmallAlbumCardSkeleton key={index} />)
              : albums.map((album) => <SmallAlbumCard key={album.id} {...album} />)}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

RelatedTab.propTypes = { song: PropTypes.object, artist: PropTypes.object };

export default RelatedTab;

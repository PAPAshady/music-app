import SmallAlbumCard from '../../MusicCards/SmallAlbumCard/SmallAlbumCard';
import SmallAlbumCardSkeleton from '../../MusicCards/SmallAlbumCard/SmallAlbumCardSkeleton';
import { useQuery } from '@tanstack/react-query';
import { getAlbumsByArtistIdQueryOptions } from '../../../queries/albums';
import PropTypes from 'prop-types';

function ArtistInfosPanelAlbumsList({ artistId }) {
  const { data: albums, isPending: isAlbumsPending } = useQuery(
    getAlbumsByArtistIdQueryOptions(artistId)
  );
  return (
    <div className="pe-2">
      <p className="ps-3 pb-3 text-xl font-bold text-white">Albums</p>
      <div className="flex flex-col gap-2">
        {isAlbumsPending ? (
          Array(3)
            .fill()
            .map((_, index) => <SmallAlbumCardSkeleton key={index} />)
        ) : albums.length ? (
          albums.map((album) => <SmallAlbumCard key={album.id} {...album} />)
        ) : (
          <p className="ps-2 pt-1 text-sm">No albums found from this artist.</p>
        )}
      </div>
    </div>
  );
}

ArtistInfosPanelAlbumsList.propTypes = { artistId: PropTypes.string };

export default ArtistInfosPanelAlbumsList;

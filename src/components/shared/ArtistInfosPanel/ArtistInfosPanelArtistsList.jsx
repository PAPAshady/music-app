import { getRelatedArtistsQueryOptions } from '../../../queries/artists';
import SmallArtistCardSkeleton from '../../MusicCards/SmallArtistCard/SmallArtistCardSkeleton';
import SmallArtistCard from '../../MusicCards/SmallArtistCard/SmallArtistCard';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';

function ArtistInfosPanelArtistsList({ artist }) {
  const { data: relatedArtists, isPending: isRelatedArtistsPending } = useQuery(
    getRelatedArtistsQueryOptions(artist)
  );
  return (
    <div className="pe-2">
      <p className="ps-3 pb-3 text-xl font-bold text-white">Fans also like</p>
      <div className="grid grid-cols-3 gap-x-2 gap-y-4">
        {isRelatedArtistsPending
          ? Array(6)
              .fill()
              .map((_, index) => <SmallArtistCardSkeleton key={index} size="sm" />)
          : relatedArtists.map((artist) => (
              <SmallArtistCard key={artist.id} size="sm" artist={artist} />
            ))}
      </div>
    </div>
  );
}

ArtistInfosPanelArtistsList.propTypes = { artist: PropTypes.object };

export default ArtistInfosPanelArtistsList;

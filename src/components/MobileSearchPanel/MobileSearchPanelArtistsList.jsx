import MobileSearchPanelSectionTitle from './MobileSearchPanelSectionTitle';
import SmallArtistCard from '../MusicCards/SmallArtistCard/SmallArtistCard';
import SmallArtistCardSkeleton from '../MusicCards/SmallArtistCard/SmallArtistCardSkeleton';
import { Profile2User } from 'iconsax-reactjs';
import PropTypes from 'prop-types';

function MobileSearchPanelArtistsList({ artists, isArtistsPending }) {
  return (
    <div>
      <MobileSearchPanelSectionTitle title="Artists" icon={<Profile2User />} />
      <div className="grid grid-cols-3 gap-4 px-1 min-[500px]:grid-cols-4 min-[900px]:!grid-cols-6 sm:grid-cols-5">
        {isArtistsPending
          ? Array(6)
              .fill()
              .map((_, index) => <SmallArtistCardSkeleton key={index} size="md" />)
          : artists.map((artist) => <SmallArtistCard size="md" key={artist.id} artist={artist} />)}
      </div>
    </div>
  );
}

MobileSearchPanelArtistsList.propTypes = {
  artists: PropTypes.array,
  isArtistsPending: PropTypes.bool.isRequired,
};

export default MobileSearchPanelArtistsList;

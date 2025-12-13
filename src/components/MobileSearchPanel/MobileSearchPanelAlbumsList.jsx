import MobileSearchPanelSectionTitle from './MobileSearchPanelSectionTitle';
import AlbumCard from '../MusicCards/AlbumCard/AlbumCard';
import AlbumCardSkeleton from '../MusicCards/AlbumCard/AlbumCardSkeleton';
import { MusicPlaylist } from 'iconsax-reactjs';
import PropTypes from 'prop-types';

function MobileSearchPanelAlbumsList({ albums, isAlbumsPending }) {
  return (
    <div>
      <MobileSearchPanelSectionTitle title="Albums" icon={<MusicPlaylist />} />
      <div className="grid grid-cols-1 gap-3 px-1 sm:grid-cols-2">
        {isAlbumsPending
          ? Array(4)
              .fill()
              .map((_, index) => <AlbumCardSkeleton key={index} size="md" />)
          : albums.map((album) => (
              <AlbumCard size="md" key={album.id} album={album} classNames="!max-w-none" />
            ))}
      </div>
    </div>
  );
}

MobileSearchPanelAlbumsList.propTypes = {
  albums: PropTypes.array,
  isAlbumsPending: PropTypes.bool.isRequired,
};

export default MobileSearchPanelAlbumsList;

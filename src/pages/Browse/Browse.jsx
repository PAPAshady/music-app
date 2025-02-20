import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import SectionTitle from '../../components/SectionHeader/SectionHeader';
import TracksSlider from '../../components/TracksSlider/TracksSlider';
import PlaylistsSlider from '../../components/PlaylistsSlider/PlaylistsSlider';
import DiscoverPlaylistsSlider from '../../components/DiscoverPlaylistsSlider/DiscoverPlaylistsSlider';
import ArtistsSlider from '../../components/ArtistsSlider/ArtistsSlider';
import GenresSlider from '../../components/GenresSlider/GenresSlider';
import AlbumsSlider from '../../components/AlbumsSlider/AlbumsSlider';
import { songs, playlists, artists, genres, albums } from '../../data';

export default function Browse() {
  return (
    <div className="flex w-full items-start gap-6">
      <div className="flex grow flex-col gap-8 lg:gap-10">
        <div>
          <SectionTitle title="Tranding Tracks" />
          <TracksSlider songs={songs} />
        </div>
        <div>
          <SectionTitle title="Trending Playlists" />
          <PlaylistsSlider playlists={playlists} />
        </div>
        <DiscoverPlaylistsSlider playlists={playlists} />
        <div>
          <SectionTitle title="People's Favorite Artists" />
          <ArtistsSlider artists={artists} />
        </div>
        <div>
          <SectionTitle title="Trending Genres" />
          <GenresSlider genres={genres} />
        </div>
        <div>
          <SectionTitle title="Trending Albums" />
          <AlbumsSlider albums={albums} albumCardSize="md" albumCardStyles="!max-w-none" />
        </div>
      </div>
      <SidebarPlaylist playList={songs} />
    </div>
  );
}

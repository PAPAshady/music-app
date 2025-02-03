import songCover1 from './assets/images/covers/when-i-grow-up-nf.jpg';
import songCover2 from './assets/images/covers/endless-love-dvrst.jpg';
import songCover3 from './assets/images/covers/given-up-linkinpark.jpg';
import songCover4 from './assets/images/covers/true-love-waits-radiohead.jpg';
import trackCardImg1 from './assets/images/covers/recently-listened.jpg';
import trackCardImg2 from './assets/images/covers/most-listened.jpg';
import trackCardImg3 from './assets/images/covers/liked-tracks.jpg';
import playlistCoverImg1 from './assets/images/covers/playlist-cover-1.jpg';
import playlistCoverImg2 from './assets/images/covers/playlist-cover-2.jpg';
import playlistCoverImg3 from './assets/images/covers/playlist-cover-3.jpg';
import playlistCoverImg4 from './assets/images/covers/playlist-cover-4.jpg';

export const sidebarPlaylistSongs = [
  {
    id: 1,
    title: 'When i grow up',
    artist: 'NF',
    album: 'The search',
    time: '3:12',
  },
  {
    id: 2,
    title: 'Endless Love',
    artist: 'DVRST',
    album: 'Single',
    time: '3:12',
    isLiked: true,
    cover: songCover1,
  },
  {
    id: 3,
    title: 'Given Up',
    artist: 'Linkin Park',
    time: '3:02',
  },
  {
    id: 4,
    title: 'True Love Waits',
    artist: 'Radiohead',
    time: '5:23',
    album: 'A Moon Shaped Pool',
    isLiked: true,
    cover: songCover2,
  },
  { id: 5, title: 'When i grow up', artist: 'NF', album: 'The search', time: '3:12' },
  {
    id: 6,
    title: 'Endless Love',
    artist: 'DVRST',
    album: 'Single',
    time: '3:12',
    isLiked: true,
    cover: songCover3,
  },
  {
    id: 7,
    title: 'Given Up',
    artist: 'Linkin Park',
    time: '3:02',
  },
  {
    id: 8,
    title: 'True Love Waits',
    artist: 'Radiohead',
    time: '5:23',
    album: 'A Moon Shaped Pool',
    cover: songCover4,
  },
];

export const tracksCardsInfos = [
  { id: 1, title: 'Recently Listened', image: trackCardImg1 },
  { id: 2, title: 'Most Listened', image: trackCardImg2 },
  { id: 3, title: 'Liked Tracks', image: trackCardImg3 },
];

export const playlists = [
  { id: 1, title: 'Arcane', numberOfTracks: 86, image: playlistCoverImg1, isFavorite: true },
  { id: 2, title: 'Eyes', numberOfTracks: 256, image: playlistCoverImg2 },
  { id: 3, title: 'No Shame', numberOfTracks: 98, image: playlistCoverImg3, isFavorite: true },
  { id: 4, title: 'Till Dusk', numberOfTracks: 42, image: playlistCoverImg4 },
  { id: 5, title: 'V.E.T', numberOfTracks: 87, image: playlistCoverImg1, isFavorite: true },
  { id: 6, title: 'Pop Hits', numberOfTracks: 86, image: playlistCoverImg2 },
  {
    id: 7,
    title: 'Best Of Hip-Hop',
    numberOfTracks: 256,
    image: playlistCoverImg3,
    isFavorite: true,
  },
  { id: 8, title: 'Rock & Roll', numberOfTracks: 98, image: playlistCoverImg4 },
  { id: 9, title: 'Electronics', numberOfTracks: 134, image: playlistCoverImg1, isFavorite: true },
  { id: 10, title: 'Bombs', numberOfTracks: 111, image: playlistCoverImg2 },
];

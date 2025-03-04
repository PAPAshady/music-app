import songCover1 from './assets/images/covers/song-cover-1.jpg';
import songCover2 from './assets/images/covers/song-cover-2.jpg';
import songCover3 from './assets/images/covers/song-cover-3.jpg';
import songCover4 from './assets/images/covers/song-cover-4.jpg';
import songCover5 from './assets/images/covers/song-cover-5.jpg';
import songCover6 from './assets/images/covers/song-cover-6.jpg';
import songCover7 from './assets/images/covers/song-cover-7.jpg';
import songCover8 from './assets/images/covers/song-cover-8.jpg';
import songCover9 from './assets/images/covers/song-cover-9.jpg';
import songCover10 from './assets/images/covers/song-cover-10.jpg';
import trackCardImg1 from './assets/images/covers/track-cover-1.jpg';
import trackCardImg2 from './assets/images/covers/track-cover-2.jpg';
import trackCardImg3 from './assets/images/covers/track-cover-3.jpg';
import trackCardImg4 from './assets/images/covers/track-cover-4.jpg';
import trackCardImg5 from './assets/images/covers/track-cover-5.jpg';
import trackCardImg6 from './assets/images/covers/track-cover-6.jpg';
import trackCardImg7 from './assets/images/covers/track-cover-7.jpg';
import trackCardImg8 from './assets/images/covers/track-cover-8.jpg';
import trackCardImg9 from './assets/images/covers/track-cover-9.jpg';
import trackCardImg10 from './assets/images/covers/track-cover-10.jpg';
import trackCardImg11 from './assets/images/covers/track-cover-11.jpg';
import trackCardImg12 from './assets/images/covers/track-cover-12.jpg';
import trackCardImg13 from './assets/images/covers/track-cover-13.jpg';
import trackCardImg14 from './assets/images/covers/track-cover-14.jpg';
import trackCardImg15 from './assets/images/covers/track-cover-15.jpg';
import playlistCoverImg1 from './assets/images/covers/playlist-cover-1.jpg';
import playlistCoverImg2 from './assets/images/covers/playlist-cover-2.jpg';
import playlistCoverImg3 from './assets/images/covers/playlist-cover-3.jpg';
import playlistCoverImg4 from './assets/images/covers/playlist-cover-4.jpg';
import playlistCoverImg5 from './assets/images/covers/playlist-cover-5.png';
import playlistCoverImg6 from './assets/images/covers/playlist-cover-6.jpg';
import playlistCoverImg7 from './assets/images/covers/playlist-cover-7.jpg';
import playlistCoverImg8 from './assets/images/covers/playlist-cover-8.jpg';
import playlistCoverImg9 from './assets/images/covers/playlist-cover-9.jpg';
import playlistCoverImg10 from './assets/images/covers/playlist-cover-10.jpg';
import albumCover1 from './assets/images/covers/album-cover-1.jpg';
import albumCover2 from './assets/images/covers/album-cover-2.jpg';
import albumCover3 from './assets/images/covers/album-cover-3.jpg';
import albumCover4 from './assets/images/covers/album-cover-4.jpg';
import albumCover5 from './assets/images/covers/album-cover-5.jpg';
import albumCover6 from './assets/images/covers/album-cover-6.png';
import albumCover7 from './assets/images/covers/album-cover-7.jpg';
import albumCover8 from './assets/images/covers/album-cover-8.jpg';
import albumCover9 from './assets/images/covers/album-cover-9.jpg';
import artist1 from './assets/images/artists/artist-1.jpg';
import artist2 from './assets/images/artists/artist-2.jpg';
import artist3 from './assets/images/artists/artist-3.jpeg';
import artist4 from './assets/images/artists/artist-4.jpg';
import artist5 from './assets/images/artists/artist-5.jpg';
import artist6 from './assets/images/artists/artist-6.jpg';
import artist7 from './assets/images/artists/artist-7.jpg';
import artist8 from './assets/images/artists/artist-8.jpg';
import artist9 from './assets/images/artists/artist-9.jpg';
import artist10 from './assets/images/artists/artist-10.jpg';
import artist11 from './assets/images/artists/artist-11.jpg';
import teamMemeber1 from './assets/images/Team-members/team-member-1.jpg';
import teamMemeber2 from './assets/images/Team-members/team-member-2.jpg';
import teamMemeber3 from './assets/images/Team-members/team-member-3.jpg';
import teamMemeber4 from './assets/images/Team-members/team-member-4.jpg';
import { ReceiveSquare, User, Music, MusicSquareSearch, Sms, Call, Location } from 'iconsax-react';

export const songs = [
  {
    id: 1,
    title: 'When I Grow Up',
    artist: 'NF',
    album: 'The Search',
    time: '2:11',
    cover: songCover1,
    isFavorite: true,
    isPlaying: true,
  },
  {
    id: 2,
    title: 'Endless Love',
    artist: 'DVRST',
    album: 'Memories Of Childhood',
    time: '3:19',
    cover: songCover2,
  },
  {
    id: 3,
    title: 'Wake',
    artist: 'Linkin Park',
    album: 'Minutes To Midnight',
    time: '1:09',
    cover: songCover3,
    isFavorite: true,
  },
  {
    id: 4,
    title: 'True Love Waits',
    artist: 'Radiohead',
    album: 'A Moon Shaped Pool',
    time: '2:17',
    cover: songCover4,
  },
  {
    id: 5,
    title: 'Bliding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    time: '4:06',
    cover: songCover5,
    isFavorite: true,
  },
  {
    id: 6,
    title: 'Him And I',
    artist: 'G-Easy & Halsey',
    album: 'The Beautiful & Damned',
    time: '4:01',
    cover: songCover6,
  },
  {
    id: 7,
    title: 'Celestial',
    artist: 'Ed Sheeran',
    album: 'Single',
    time: '1:11',
    cover: songCover7,
    isFavorite: true,
  },
  {
    id: 8,
    title: 'Fed Up',
    artist: 'GHOSTEMANE',
    album: 'ANTI-ICON',
    time: '2:14',
    cover: songCover8,
  },
  {
    id: 9,
    title: 'Dancin',
    artist: 'Aaron Smith ft. Luvli',
    album: "Dancin' (Remixes)",
    time: '2:35',
    cover: songCover9,
    isFavorite: true,
  },
  {
    id: 10,
    title: 'Freaks',
    artist: 'Surf Curse',
    album: 'Buds',
    time: '2:28',
    cover: songCover10,
  },
];

export const genres = [
  { id: 1, title: 'Recently Listened', image: trackCardImg1 },
  { id: 2, title: 'Most Listened', image: trackCardImg2 },
  { id: 3, title: 'Liked Tracks', image: trackCardImg3 },
  { id: 4, title: 'Pop', image: trackCardImg4 },
  { id: 5, title: 'Hip-Hop', image: trackCardImg5 },
  { id: 6, title: 'Rap', image: trackCardImg6 },
  { id: 7, title: 'Country', image: trackCardImg7 },
  { id: 8, title: 'Funk', image: trackCardImg8 },
  { id: 9, title: 'Classic', image: trackCardImg9 },
  { id: 10, title: 'Jazz', image: trackCardImg10 },
  { id: 11, title: 'Blues', image: trackCardImg11 },
  { id: 12, title: 'House Music', image: trackCardImg12 },
  { id: 13, title: 'K-pop', image: trackCardImg13 },
  { id: 14, title: 'Heavy Metal', image: trackCardImg14 },
  { id: 15, title: 'Rock', image: trackCardImg15 },
];

export const playlists = [
  { id: 1, title: 'Arcane', numberOfTracks: 87, image: playlistCoverImg5, isFavorite: true },
  { id: 2, title: 'Eyes', numberOfTracks: 256, image: playlistCoverImg2 },
  { id: 3, title: 'No Shame', numberOfTracks: 98, image: playlistCoverImg3, isFavorite: true },
  { id: 4, title: 'Till Dusk', numberOfTracks: 42, image: playlistCoverImg4 },
  { id: 5, title: 'V.E.T', numberOfTracks: 86, image: playlistCoverImg1, isFavorite: true },
  { id: 6, title: 'Pop Hits', numberOfTracks: 86, image: playlistCoverImg6 },
  {
    id: 7,
    title: 'Best Of Hip-Hop',
    numberOfTracks: 256,
    image: playlistCoverImg7,
    isFavorite: true,
  },
  { id: 8, title: 'Rock & Roll', numberOfTracks: 98, image: playlistCoverImg8 },
  { id: 9, title: 'Electronics', numberOfTracks: 134, image: playlistCoverImg9, isFavorite: true },
  { id: 10, title: 'Bombs', numberOfTracks: 111, image: playlistCoverImg10 },
];

export const albums = [
  { id: 1, name: 'Hope', singer: 'NF', tracks: 12, image: albumCover1, isFavorite: true },
  { id: 2, name: 'Kamikaze', singer: 'Eminem', tracks: 16, image: albumCover2 },
  {
    id: 3,
    name: 'Happier Than Ever',
    singer: 'Billie Eilish',
    tracks: 15,
    image: albumCover3,
    isFavorite: true,
  },
  { id: 4, name: 'A Girl Like Me', singer: 'Rihanna', tracks: 19, image: albumCover4 },
  {
    id: 5,
    name: 'Smoke + Mirrors',
    singer: 'Imagine Dragons',
    tracks: 11,
    image: albumCover5,
    isFavorite: true,
  },
  { id: 6, name: 'The E.N.D', singer: 'The Black Eyed Peas', tracks: 7, image: albumCover6 },
  {
    id: 7,
    name: 'Hurry Up Tomorrow',
    singer: 'The Weeknd',
    tracks: 12,
    image: albumCover7,
    isFavorite: true,
  },
  { id: 8, name: 'Hybrid Theory', singer: 'Linkin Park', tracks: 18, image: albumCover8 },
  {
    id: 9,
    name: 'Astronomical',
    singer: 'Masked Wolf',
    tracks: 9,
    image: albumCover9,
    isFavorite: true,
  },
];

export const artists = [
  { id: 1, name: 'NF', image: artist1 },
  { id: 2, name: 'Eminem', image: artist2 },
  { id: 3, name: 'Billie Eilish', image: artist3 },
  { id: 4, name: 'Tupac Shakur', image: artist4 },
  { id: 5, name: 'Ed Sheeran', image: artist5 },
  { id: 6, name: 'Katy Perry', image: artist6 },
  { id: 7, name: 'Rihanna', image: artist7 },
  { id: 8, name: 'Ray Charles', image: artist8 },
  { id: 9, name: 'Frank Sinatra', image: artist9 },
  { id: 10, name: 'The Weeknd', image: artist10 },
  { id: 11, name: 'Amy Winehouse', image: artist11 },
];

export const lyrics = [
  { id: 0, lyric: 'Mais aussi', isShown: false },
  { id: 1, lyric: "Encore plus près d'tes adversaires", isShown: false },
  { id: 2, lyric: 'A tattered gown and a kingdom of ash', isShown: false },
  { id: 3, lyric: "Mais ma meilleure ennemie, c'est toi", isShown: true },
  { id: 4, lyric: "Fuis-moi, le pire, c'est toi et moi", isShown: false },
  { id: 5, lyric: 'Mais si tu cherches encore ma voix', isShown: false },
  { id: 6, lyric: "Oublie-moi, le pire, c'est toi et moi", isShown: false },
  { id: 7, lyric: 'Pourquoi ton prénom me blesse', isShown: false },
  { id: 8, lyric: "Quand il se cache juste là dans l'espace?", isShown: false },
];

export const notifications = [
  { id: 1, body: 'A new song has been add to your playlist.', time: '2 min ago' },
  { id: 2, body: 'Music successfully added to favorites.', time: '2 hours ago' },
  { id: 3, body: 'A new song has been add to your playlist.', time: '10 hours ago' },
  { id: 4, body: 'Music successfully added to favorites.', time: '3 days ago' },
  { id: 5, body: 'A new song has been add to your playlist.', time: '2 weeks ago' },
  { id: 6, body: 'Music successfully added to favorites.', time: '1 month ago' },
];

export const usageChartData = [
  { month: 'Jan', music: 10, musicVideo: 15, webBrowsing: 13 },
  { month: 'Feb', music: 13, musicVideo: 17, webBrowsing: 7 },
  { month: 'Mar', music: 15, musicVideo: 13, webBrowsing: 16 },
  { month: 'Apr', music: 17, musicVideo: 19, webBrowsing: 22 },
  { month: 'May', music: 12, musicVideo: 24, webBrowsing: 19 },
  { month: 'Jun', music: 19, musicVideo: 34, webBrowsing: 14 },
  { month: 'Jul', music: 26, musicVideo: 30, webBrowsing: 20 },
  { month: 'Aug', music: 31, musicVideo: 38, webBrowsing: 24 },
  { month: 'Sep', music: 36, musicVideo: 40, webBrowsing: 30 },
  { month: 'Oct', music: 30, musicVideo: 35, webBrowsing: 21 },
  { month: 'Nov', music: 39, musicVideo: 30, webBrowsing: 35 },
  { month: 'Dec', music: 45, musicVideo: 27, webBrowsing: 42 },
];

export const teamMembers = [
  { id: 1, name: 'Ada Wong', profilePic: teamMemeber1, memberId: '@ada_wong' },
  { id: 2, name: 'Leon Kennedy', profilePic: teamMemeber2, memberId: '@scottkennedy' },
  { id: 3, name: 'Chris Redfield', profilePic: teamMemeber3, memberId: '@chris_redfield11' },
  { id: 4, name: 'Jill Valentine', profilePic: teamMemeber4, memberId: '@valentine_jill' },
];

export const faqQuestions = [
  {
    id: 1,
    icon: <ReceiveSquare />,
    question: 'Is music download free?',
    answer:
      'We offer both free and premium downloads. Some tracks can be downloaded for free, while others require a subscription for access',
  },
  {
    id: 2,
    icon: <User />,
    question: 'How do I sign up?',
    answer:
      'You can sign up by clicking the "Sign Up" button on the homepage. Simply fill in your details or use a social media account to register quickly.',
  },
  {
    id: 3,
    icon: <Music />,
    question: 'Can I listen offline?',
    answer:
      'Yes, you can download tracks with our premium subscription and enjoy them offline whenever you want.',
  },
  {
    id: 4,
    icon: <MusicSquareSearch />,
    question: 'What genres are available?',
    answer:
      'VioTune features a wide range of genres, including pop, rock, jazz, classical, and electronic. Explore the library to discover your favorites.',
  },
  {
    id: 5,
    icon: <Music />,
    question: 'Can I listen offline?',
    answer:
      'Yes, you can download tracks with our premium subscription and enjoy them offline whenever you want.',
  },
  {
    id: 6,
    icon: <ReceiveSquare />,
    question: 'Is music download free?',
    answer:
      'We offer both free and premium downloads. Some tracks can be downloaded for free, while others require a subscription for access',
  },
];

export const contactInfos = [
  {
    id: 1,
    icon: <Sms />,
    title: 'Email',
    description: 'Our friendly team is here to help.',
    contactInfo: 'Zamani.nima18@gmail.com',
  },
  {
    id: 2,
    icon: <Call />,
    title: 'Phone',
    description: 'Our friendly team is here to help.',
    contactInfo: '+1 (555) 000-0000',
  },
  {
    id: 3,
    icon: <Location />,
    title: 'Office',
    description: 'Our friendly team is here to help.',
    contactInfo: '100 Smith Street',
  },
];

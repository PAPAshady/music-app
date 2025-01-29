import SidebarPlaylist from '../../components/SidebarPlaylist/SidebarPlaylist';
import songCover1 from '../../assets/images/covers/when-i-grow-up-nf.jpg';
import songCover2 from '../../assets/images/covers/endless-love-dvrst.jpg';
import songCover3 from '../../assets/images/covers/given-up-linkinpark.jpg';
import songCover4 from '../../assets/images/covers/true-love-waits-radiohead.jpg';

export default function Home() {
  const playList = [
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

  return (
    <div className="flex items-start gap-4">
      <div className="grow">Home Content</div>
      <div className="hidden lg:block">
        <SidebarPlaylist playList={playList} />
      </div>
    </div>
  );
}

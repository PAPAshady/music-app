import TracksSlider from '../../components/Sliders/TracksSlider/TracksSlider';
import ArtistsSlider from '../../components/Sliders/ArtistsSlider/ArtistsSlider';
import SettingsPagesSectionHeader from '../../components/SettingsPagesSectionHeader/SettingsPagesSectionHeader';
import { songs, usageChartData } from '../../data';
import { getArtistsQueryOptions } from '../../queries/artists';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Legend,
  Tooltip,
  Line,
  XAxis,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import useMediaQuery from '../../hooks/useMediaQuery';

export default function Analytics() {
  const artists = useQuery(getArtistsQueryOptions());
  const isTablet = useMediaQuery('(min-width: 640px)');

  return (
    <div className="flex flex-col gap-8 pt-8 lg:gap-12">
      <div className="mb-4 text-center">
        <p className="mb-4 text-2xl font-bold md:text-4xl">Your Activity</p>
        <p className="text-primary-200 md:text-xl">
          You&apos;ve been busy scince last week! check it out
        </p>
      </div>
      <div>
        <SettingsPagesSectionHeader title="Songs you've listened to a lot this month" />
        <TracksSlider songs={songs} />
      </div>
      <div>
        <SettingsPagesSectionHeader title="Singers who were very popular with you" />
        <ArtistsSlider artists={artists.data} isLoading={artists.isLoading} />
      </div>
      <div>
        <SettingsPagesSectionHeader title="Your Usage VioTune Rate" />
        <ResponsiveContainer width="100%" aspect={isTablet ? 2 : 1.2}>
          <LineChart data={usageChartData}>
            <Legend verticalAlign="top" height={45} />
            <Tooltip />
            <XAxis dataKey="month" stroke="#f9f9f9" />
            <CartesianGrid vertical={false} />
            <Line type="monotone" name="Music" dataKey="music" stroke="#ab3030" strokeWidth={2} />
            <Line
              type="monotone"
              name="Music Video"
              dataKey="musicVideo"
              stroke="#61d55b"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              name="Web Browsing"
              dataKey="webBrowsing"
              stroke="#bdad37"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

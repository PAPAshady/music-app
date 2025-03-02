import TracksSlider from '../../../components/Sliders/TracksSlider/TracksSlider';
import ArtistsSlider from '../../../components/Sliders/ArtistsSlider/ArtistsSlider';
import { songs, artists } from '../../../data';
import PropTypes from 'prop-types';

export default function Analytics() {
  return (
    <div className="flex flex-col gap-8 pt-8 lg:gap-12">
      <div className="mb-4 text-center">
        <p className="mb-4 text-2xl font-bold md:text-4xl">Your Activity</p>
        <p className="text-primary-200 md:text-xl">
          You&apos;ve been busy scince last week! check it out
        </p>
      </div>
      <div>
        <SectionTitle title="Songs you've listened to a lot this month" />
        <TracksSlider songs={songs} />
      </div>
      <div>
        <SectionTitle title="Singers who were very popular with you" />
        <ArtistsSlider artists={artists} />
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <h4 className="text-primary-50 mb-6 text-center text-lg font-semibold md:mb-8 md:text-2xl">
      {title}
    </h4>
  );
}

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

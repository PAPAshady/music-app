import PropTypes from 'prop-types';
import FAQQuestion from '../../components/FAQQuestion/FAQQuestion';
import useMediaQuery from '../../hooks/useMediaQuery';
import { faqQuestions } from '../../data';

export default function FAQ() {
  const isTablet = useMediaQuery('(min-width: 540px)');
  return (
    <div className="flex flex-col gap-8 pt-8 lg:gap-12">
      <div>
        <SectionInfo
          title="Ask Us Anything"
          description="Need Something Cleared Up? Here Are Our Most Frequently Asked Questions."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 lg:gap-8">
          {faqQuestions.slice(0, isTablet ? faqQuestions.length : 3).map((question) => (
            <FAQQuestion key={question.id} {...question} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionInfo({ title, description }) {
  return (
    <div className="mb-8 text-center md:mb-14">
      <p className="mb-4 text-2xl font-bold md:text-3xl">{title}</p>
      <p className="text-primary-200 md:text-lg">{description}</p>
    </div>
  );
}

SectionInfo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

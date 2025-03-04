import SettingsPagesSectionHeader from '../../components/SettingsPagesSectionHeader/SettingsPagesSectionHeader';
import FAQQuestion from '../../components/FAQQuestion/FAQQuestion';
import useMediaQuery from '../../hooks/useMediaQuery';
import { faqQuestions } from '../../data';

export default function FAQ() {
  const isTablet = useMediaQuery('(min-width: 540px)');
  return (
    <div className="flex flex-col gap-8 pt-8 lg:gap-12">
      <div>
        <SettingsPagesSectionHeader
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


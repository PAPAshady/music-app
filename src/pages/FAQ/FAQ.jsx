import SettingsPagesSectionHeader from '../../components/SettingsPagesSectionHeader/SettingsPagesSectionHeader';
import FAQQuestion from '../../components/FAQQuestion/FAQQuestion';
import ContactInfoBox from '../../components/ContactInfoBox/ContactInfoBox';
import useMediaQuery from '../../hooks/useMediaQuery';
import { faqQuestions, contactInfos } from '../../data';

export default function FAQ() {
  const isTablet = useMediaQuery('(min-width: 540px)');
  return (
    <>
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
      <div>
        <SettingsPagesSectionHeader
          title="We’d Love To Hear From You"
          description="Our Friendly Team Is Always Here To Chat."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
          {contactInfos.map((info) => (
            <ContactInfoBox key={info.id} {...info} />
          ))}
        </div>
      </div>
    </>
  );
}


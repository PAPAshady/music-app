import Avatar from '../../components/Avatar/Avatar';
import profileImg from '../../assets/images/Avatar/profile-pic.jpg';
import useMediaQuery from '../../hooks/useMediaQuery';
import EmailInput from '../../components/Inputs/InputField/InputField';
import InputField from '../../components/Inputs/InputField/InputField';
import TextArea from '../../components/Inputs/TextArea/TextArea';
import MainButton from '../../components/Buttons/MainButton/MainButton';
import useInput from '../../hooks/useInput';

export default function Profile() {
  const isTablet = useMediaQuery('(min-width: 768px)');
  const firstNameInput = useInput();
  const lastNameInput = useInput();
  const emailInput = useInput();
  const bioInput = useInput();

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6 md:pt-8">
        <button>
          <Avatar size={isTablet ? 'lg' : 'md'} profilePic={profileImg} />
        </button>
        <div className="text-center md:text-start">
          <p className="text-primary-50 font-semibold sm:text-lg md:mb-2 md:text-2xl">
            Olivia Rhye
          </p>
          <span className="text-primary-100 text-sm sm:text-base md:text-xl">@olivia</span>
        </div>
      </div>
      <form
        action="#"
        className="container flex !max-w-[720px] flex-col gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-4">
          <InputField placeholder="Firstname" {...firstNameInput} />
          <InputField placeholder="Lastname" {...lastNameInput} />
        </div>
        <EmailInput placeholder="Email" {...emailInput} />
        <TextArea placeholder="Bio" maxLength={150} {...bioInput} />
        <div className="flex items-center justify-end gap-3">
          <MainButton title="Cancel" size="lg" type="text" />
          <MainButton title="Save" size="lg" variant="secondary" />
        </div>
      </form>
    </div>
  );
}

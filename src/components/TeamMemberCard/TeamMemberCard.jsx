import Avatar from '../Avatar/Avatar';
import socialIcon1 from '../../assets/images/special-icons/x.png';
import socialIcon2 from '../../assets/images/special-icons/linkdin.png';
import socialIcon3 from '../../assets/images/special-icons/dribbble.png';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default function TeamMemberCard({ name, profilePic, memberId, classNames }) {
  const socials = [
    { id: 1, img: socialIcon1, socialMediaTitle: 'X' },
    { id: 2, img: socialIcon2, socialMediaTitle: 'Linkdin' },
    { id: 3, img: socialIcon3, socialMediaTitle: 'Dribbble' },
  ];

  return (
    <div
      className={`hover:bg-secondary-400/53 duraiton-300 !w-full flex flex-col items-center gap-5 rounded-2xl p-4 text-center transition-colors ${classNames}`}
    >
      <Avatar size="md" profilePic={profilePic} />
      <div className="w-full">
        <div className="mb-5">
          <p className="text-primary-50 mb-1 truncate lg:text-lg">{name}</p>
          <span className="text-primary-100 block truncate text-sm lg:text-base">{memberId}</span>
        </div>
        <div className="flex items-center justify-center gap-3">
          {socials.map((social) => (
            <SocialLinkImg key={social.id} {...social} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SocialLinkImg({ img, href = '#', socialMediaTitle }) {
  return (
    <Link to={href}>
      <img src={img} alt={socialMediaTitle} />
    </Link>
  );
}

TeamMemberCard.propTypes = {
  name: PropTypes.string.isRequired,
  profilePic: PropTypes.string,
  memberId: PropTypes.string.isRequired,
  classNames: PropTypes.string,
};

SocialLinkImg.propTypes = {
  img: PropTypes.string.isRequired,
  href: PropTypes.string,
  socialMediaTitle: PropTypes.string.isRequired,
};

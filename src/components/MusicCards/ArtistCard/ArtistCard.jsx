import { memo } from 'react';
import PropTypes from 'prop-types';
import noAvatarImg from '../../../assets/images/Avatar/no-avatar.png';

const ArtistCard = memo(({ name, image = noAvatarImg }) => {
  return (
    <div className="lg:border-secondary-300 lg:bg-secondary-700/48 lg:hover:border-secondary-100 hover:border-secondary-300 lg:hover:bg-secondary-500/40 px- inline-flex flex-col items-center gap-3 rounded-lg border border-transparent bg-[rgba(0,0,0,0.32)] py-4 inset-shadow-[2px_2px_6px_-1px] shadow-[4px_4px_8px_1px] shadow-[rgba(0,0,0,0.2)] inset-shadow-[#4A639B]/65 transition-all duration-400 lg:py-5 lg:inset-shadow-[4px_4px_8px_1px] lg:hover:inset-shadow-[4px_4px_10px_1px] lg:hover:shadow-[rgba(0,0,0,0.4)] lg:hover:inset-shadow-[#A7BBE9]/29">
      <div className="px-6">
        <div className="size-[72px] overflow-hidden rounded-full lg:size-[120px]">
          <img className="size-full object-cover flex justify-center items-center" src={image} alt={name} />
        </div>
      </div>

      <p className="text-white-50 flex h-8 max-w-[100px] items-center px-3 text-center text-sm lg:max-w-[180px] lg:text-base">
        {name}
      </p>
    </div>
  );
});

ArtistCard.displayName = 'ArtistCard';
  
ArtistCard.propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.string,
};

export default ArtistCard;

import { cloneElement } from 'react';
import MainButton from '../Buttons/MainButton/MainButton';
import { Headphone, VoiceCricle, Import } from 'iconsax-react';
import PropTypes from 'prop-types';

export default function PermiumCard({ title, permiumType, price, disabled }) {
  const cardOptions = [
    { id: 1, icon: <Headphone />, title: 'Ad-free listening' },
    { id: 2, icon: <VoiceCricle />, title: 'High-quality audio' },
    { id: 3, icon: <Import />, title: 'Offline downloads' },
  ];

  // hover effects only works if the card is NOT disabled.
  const hoverEffects =
    'hover:bg-secondary-400/40 hover:inset-shadow-[4px_4px_8px_2px] hover:inset-shadow-[#4873AE]/40 hover:shadow-[0_8px_16px] hover:shadow-[#121418]/48 lg:hover:border-primary-200';

  return (
    <div
      className={`group inline-flex max-w-[240px] flex-col gap-6 rounded-lg border p-6 text-center transition-all duration-300 lg:max-w-[290px] lg:gap-9 ${disabled ? 'border-white-700 bg-white-800/70' : `border-secondary-300 bg-black/24 lg:border-transparent lg:bg-[#092142]/52 lg:inset-shadow-[4px_4px_8px_2px] lg:inset-shadow-[#4873AE]/40 ${hoverEffects}`}`}
    >
      <p
        className={`text-lg lg:text-2xl lg:font-semibold ${disabled ? 'text-white-500' : 'text-white-50'}`}
      >
        {permiumType}
      </p>
      <h4
        className={`text-2xl transition-colors duration-300 lg:text-[32px] ${disabled ? 'text-white-700' : 'text-primary-300 lg:group-hover:text-primary-50'}`}
      >
        {title}
      </h4>
      <div className="flex justify-center gap-1">
        <span className={`text-[32px] ${disabled ? 'text-white-700' : 'text-primary'}`}>$</span>
        <span className="text-[40px] text-white lg:text-5xl">{price}</span>
      </div>
      <ul className="flex flex-col gap-5">
        {cardOptions.map((option) => (
          <CardOption key={option.id} {...option} disabled={disabled} />
        ))}
      </ul>
      <div>
        <MainButton title="Subscribe" size="lg" disabled={disabled} />
      </div>
    </div>
  );
}

function CardOption({ icon, title, disabled }) {
  const styledIcon = cloneElement(icon, { size: '100%' });
  return (
    <li className="flex items-center justify-center gap-2">
      <span className={`size-5 lg:size-6 ${disabled ? 'text-white-700' : 'text-primary-200'}`}>
        {styledIcon}
      </span>
      <span className={disabled ? 'text-white-500' : 'text-primary-50'}>{title}</span>
    </li>
  );
}

PermiumCard.propTypes = {
  title: PropTypes.string.isRequired,
  permiumType: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};

CardOption.propTypes = {
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

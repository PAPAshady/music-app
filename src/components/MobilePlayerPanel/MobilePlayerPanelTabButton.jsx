import PropTypes from 'prop-types';

function MobilePlayerPanelTabButton({ title, onClick, isActive }) {
  return (
    <button
      className={`grow cursor-pointer border-b px-2 py-4 transition-colors md:py-6 md:text-lg ${isActive ? 'border-secondary-200' : 'border-transparent'}`}
      onClick={() => onClick(title)}
    >
      {title}
    </button>
  );
}

MobilePlayerPanelTabButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

export default MobilePlayerPanelTabButton;

import PropTypes from 'prop-types';

function TabButton({ title, isActive, tabName, onClick }) {
  return (
    <button
      onClick={() => onClick(tabName)}
      className={`grow border-b-2 py-2.5 text-sm transition-colors hover:text-white ${isActive ? 'border-secondary-100 text-white' : 'text-secondary-200 border-transparent'}`}
    >
      {title}
    </button>
  );
}

export default TabButton;

TabButton.propTypes = {
  title: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  tabName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

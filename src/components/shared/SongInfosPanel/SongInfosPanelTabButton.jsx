import PropTypes from 'prop-types';

function SongInfosPanelTabButton({ active, onClick, children }) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`grow rounded-md p-2 text-sm font-medium transition ${
        active ? 'bg-white/8 text-white' : 'text-slate-300 hover:bg-white/2'
      }`}
    >
      {children}
    </button>
  );
}

SongInfosPanelTabButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default SongInfosPanelTabButton;

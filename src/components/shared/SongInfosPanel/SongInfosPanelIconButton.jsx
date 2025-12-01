import PropTypes from 'prop-types';

function SongInfosPanelIconButton({ children, label, onClick, className = '', title, disabled }) {
  return (
    <button
      aria-label={label}
      title={title || label}
      onClick={onClick}
      disabled={disabled}
      className={
        'flex items-center justify-center rounded-lg p-2 transition hover:bg-white/6 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:outline-none ' +
        className
      }
    >
      {children}
    </button>
  );
}

export default SongInfosPanelIconButton;

SongInfosPanelIconButton.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
  title: PropTypes.string,
  disabled: PropTypes.bool,
};

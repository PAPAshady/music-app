import { InfoCircle, TickCircle, Danger } from 'iconsax-react';
import PropTypes from 'prop-types';

export default function Snackbar({ message, type }) {
  const iconStyles = {
    success: 'text-green',
    error: 'text-red',
    warning: 'text-yellow',
  };

  return (
    <div
      className={`text-primary-50 border-primary-300 xs:w-[340px] z-50 w-[300px] rounded-sm border bg-[#4E6C96]/53 px-3 py-1.5 text-xs backdrop-blur-md transition-all ease-in-out min-[480px]:max-w-[420px] sm:max-w-[520px] sm:text-sm`}
    >
      <div className="flex items-center justify-between gap-3 py-1.5">
        <p className="truncate">{message ? message : 'Provide a message.'}</p>
        <div className={iconStyles[type]}>
          {type === 'success' ? <TickCircle /> : type === 'warning' ? <InfoCircle /> : <Danger />}
        </div>
      </div>
    </div>
  );
}

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error']),
};

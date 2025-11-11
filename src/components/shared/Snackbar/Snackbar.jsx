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
      className={`text-primary-50 border-primary-300 z-50 mx-auto w-[95%] rounded-sm border bg-[#4E6C96]/53 px-3 py-1.5 backdrop-blur-md transition-all ease-in-out min-[1200px]:!w-1/3 sm:ms-4 sm:w-[70%] md:w-1/2 lg:ms-6 lg:w-[40%]`}
    >
      <div className="flex items-center justify-between gap-3 py-1.5">
        <p className="truncate" title={message ? message : 'Provide a message.'}>
          {message ? message : 'Provide a message.'}
        </p>
        <div className={`size-8 ${iconStyles[type]}`}>
          {type === 'success' ? (
            <TickCircle size="100*" />
          ) : type === 'warning' ? (
            <InfoCircle size="100*" />
          ) : (
            <Danger size="100*" />
          )}
        </div>
      </div>
    </div>
  );
}

Snackbar.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error']),
};

import PropTypes from 'prop-types';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'sm', classNames }) {
  const width = {
    xs: 20,
    sm: 30,
    md: 40,
    lg: 50,
  };

  const thickness = {
    xs: 4,
    sm: 5,
    md: 7,
    lg: 8,
  };

  return (
    <div
      id="loading-spinner"
      className={classNames}
      style={{
        minWidth: width[size],
        WebkitMask: `radial-gradient(farthest-side,#0000 calc(100% - ${thickness[size]}px),#000 0)`,
      }}
    ></div>
  );
}

LoadingSpinner.propTypes = { size: PropTypes.string, classNames: PropTypes.string };

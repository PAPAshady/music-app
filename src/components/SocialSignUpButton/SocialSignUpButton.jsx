import PropTypes from 'prop-types';

import { useDispatch } from 'react-redux';
import { signInWithOAuth } from '../../redux/slices/authSlice';

export default function SocialSignUpButton({ imageSrc, provider, onError }) {
  const dispatch = useDispatch();

  const handleOAuth = async (provider) => {
    try {
      dispatch(signInWithOAuth(provider));
    } catch (err) {
      onError?.(err);
      console.error(`${provider} auth error:`, err);
    }
  };

  return (
    <button onClick={() => handleOAuth(provider)}>
      <img
        className="size-10 transition-transform hover:scale-110"
        src={imageSrc}
        alt={`Login with ${provider}`}
      />
    </button>
  );
}

SocialSignUpButton.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  provider: PropTypes.string.isRequired,
  onError: PropTypes.func,
};

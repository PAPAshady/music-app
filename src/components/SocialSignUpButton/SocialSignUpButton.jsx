import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { signInWithOAuth } from '../../redux/slices/authSlice';

export default function SocialSignUpButton({ imageSrc, provider }) {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(signInWithOAuth(provider))}>
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

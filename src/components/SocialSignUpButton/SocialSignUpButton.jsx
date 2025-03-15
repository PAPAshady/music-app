import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

export default function SocialSignUpButton({ imageSrc, provider, onError }) {
  const { signInWithOAuth } = useAuth();

  const handleOAuth = async (provider) => {
    try {
      await signInWithOAuth(provider);
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

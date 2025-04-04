import PropTypes from 'prop-types';

export default function SocialSignUpButton({ imageSrc, provider, onError }) {
  const handleOAuth = async () => {
    console.log('signup/signIn with oauth completed', provider);
    onError?.();
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

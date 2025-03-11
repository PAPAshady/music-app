import supabase from '../../services/supabaseClient';
import PropTypes from 'prop-types';

export default function SocialSignUpButton({ imageSrc, provider, onError }) {
  // handle signup/signin with other platforms such as google or github
  const handleOAuth = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
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

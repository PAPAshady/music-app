import PropTypes from 'prop-types';

export default function SettingsPagesSectionHeader({ title, description }) {
  return (
    <div className="mb-8 text-center md:mb-14">
      <p className="mb-4 text-2xl font-bold md:text-3xl">{title}</p>
      <p className="text-primary-200 md:text-lg">{description}</p>
    </div>
  );
}

SettingsPagesSectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
};

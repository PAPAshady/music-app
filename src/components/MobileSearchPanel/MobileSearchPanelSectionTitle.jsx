import PropTypes from 'prop-types';

function MobileSearchPanelSectionTitle({ title, icon }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {icon}
      <p className="text-2xl font-bold">{title}</p>
    </div>
  );
}

MobileSearchPanelSectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

export default MobileSearchPanelSectionTitle;

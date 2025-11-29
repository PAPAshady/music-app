import DropDownList from '../../DropDownList/DropDownList';
import IconButton from '../../IconButton/IconButton';
import { Additem } from 'iconsax-react';
import { useDispatch } from 'react-redux';
import { openModal } from '../../../redux/slices/playlistInfosModalSlice';
import { openModal as openConfirmModal } from '../../../redux/slices/confirmModalSlice';
import { Edit, Trash } from 'iconsax-react';
import PropTypes from 'prop-types';

function MobileTracklistPanelPlayButtons({ tracklistTitle, setIsAddMenuOpen }) {
  const dispatch = useDispatch();

  const playButtons = [
    {
      id: 1,
      icon: <Edit />,
      onClick: () =>
        dispatch(openModal({ title: `Edit ${tracklistTitle}`, actionType: 'edit_playlist' })),
    },
    { id: 2, icon: <Additem />, onClick: () => setIsAddMenuOpen(true) },
  ];

  const playlistDropDownListItems = [
    {
      id: 1,
      icon: <Edit />,
      title: 'Edit playlist',
      onClick: () =>
        dispatch(openModal({ title: `Edit ${tracklistTitle}`, actionType: 'edit_playlist' })),
    },
    {
      id: 2,
      icon: <Trash />,
      title: 'Delete playlist',
      onClick: () =>
        dispatch(
          openConfirmModal({
            title: `Delete "${tracklistTitle}" playlist.`,
            message: 'Are you sure you want to delete this playlist ?',
            buttons: { confirm: true, cancel: true },
            buttonsClassNames: { confirm: '!bg-red !inset-shadow-none' },
            actionType: 'delete_playlist',
          })
        ),
    },
  ];

  return (
    <>
      {playButtons.map((button) => (
        <IconButton key={button.id} classNames="sm:size-9 md:size-10" {...button} />
      ))}
      <DropDownList menuItems={playlistDropDownListItems} dropDownPlacement="bottom start" />
    </>
  );
}

export default MobileTracklistPanelPlayButtons;

MobileTracklistPanelPlayButtons.propTypes = {
  tracklistTitle: PropTypes.string,
  setIsAddMenuOpen: PropTypes.func.isRequired,
};

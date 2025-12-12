import { Image, Trash, Edit2 } from 'iconsax-reactjs';
import InputField from '../Inputs/InputField/InputField';
import TextArea from '../Inputs/TextArea/TextArea';
import DropDownList from '../DropDownList/DropDownList';
import useMediaQuery from '../../hooks/useMediaQuery';
import playlistDefaultCover from '../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const PlaylistInfosModalForm = forwardRef(function (
  {
    cover,
    setCover,
    errors,
    tracklistTitle,
    setFormValue,
    register,
    watch,
    setFormError,
    clearFormErrors,
  },
  ref
) {
  const isMobileSmall = useMediaQuery('(min-width: 371px)');

  const validateFileInput = (e) => {
    const selectedImage = e.target.files[0];
    clearFormErrors('cover');
    if (selectedImage) {
      if (!selectedImage.type.includes('image/')) {
        setFormError('cover', { message: 'Playlist cover must be an image.' });
        return;
      }

      if (selectedImage.size / 1024 ** 2 > 2) {
        setFormError('cover', { message: 'Playlist cover must be less than 2MB' });
        return;
      }

      setFormValue('cover', selectedImage, { shouldDirty: true });
      setCover(URL.createObjectURL(selectedImage));
    }
  };

  const removePlaylistCover = () => {
    ref.current.value = null;
    setCover(playlistDefaultCover);
    setFormValue('cover', null, { shouldDirty: true });
  };

  const modalDropDownListItems = [
    {
      id: 1,
      icon: <Image />,
      title: 'Change photo',
      onClick: () => ref.current.click(), // trigger the file input when the user clicks the “Change photo” dropdown item.
    },
    {
      id: 2,
      icon: <Trash />,
      title: 'Remove photo',
      onClick: removePlaylistCover,
    },
  ];

  return (
    <div className="items-cente flex flex-col gap-3 sm:flex-row">
      <div className="flex flex-col gap-1">
        <div
          className={`group relative mx-auto mt-6 size-[150px] overflow-hidden rounded-xl border transition-colors duration-200 min-[480px]:size-[180px] sm:size-[190px] sm:min-w-[190px] ${errors.cover ? 'border-red' : 'border-transparent'}`}
        >
          <img className="size-full object-cover" src={cover} alt={tracklistTitle} />
          <label
            className="absolute inset-0 size-full bg-black/30 sm:bg-transparent"
            htmlFor="choose-playlist-img"
          >
            <input
              ref={ref}
              type="file"
              className="invisible absolute"
              id="choose-playlist-img"
              accept="image/*"
              onChange={validateFileInput}
            />
            <div className="text-primary-50 flex size-full flex-col items-center justify-center gap-3 rounded-xl bg-black/50 opacity-0 backdrop-blur-xs transition-all duration-200 group-hover:opacity-100">
              <span className="size-9 text-center">
                <Edit2 size="100%" />
              </span>
              <span className="text-sm sm:text-base">Choose picture</span>
            </div>
            <div className="absolute top-2 right-2">
              <DropDownList
                menuItems={modalDropDownListItems}
                dropDownPlacement={isMobileSmall ? 'bottom start' : 'bottom'}
              />
            </div>
          </label>
        </div>
        <span
          className={`text-red mb-1 text-center text-sm transition-opacity duration-200 ${errors.cover ? 'opacity-100' : 'opacity-0'}`}
        >
          {errors.cover?.message}
        </span>
      </div>
      <div className="flex w-full grow flex-col gap-2">
        <InputField
          placeholder="Title"
          classNames="!text-sm"
          isInvalid={!!errors.title}
          errorMsg={errors.title?.message}
          {...register('title')}
        />
        <TextArea
          placeholder="Description"
          maxLength={100}
          classNames="!min-w-full !min-h-[90px] !h-[100px] text-sm"
          value={watch('description')}
          {...register('description')}
        />
      </div>
    </div>
  );
});

PlaylistInfosModalForm.displayName = 'PlaylistInfosModalForm';

PlaylistInfosModalForm.propTypes = {
  cover: PropTypes.string.isRequired,
  setCover: PropTypes.func.isRequired,
  errors: PropTypes.object,
  tracklistTitle: PropTypes.string,
  setFormValue: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  setFormError: PropTypes.func.isRequired,
  clearFormErrors: PropTypes.func.isRequired,
};

export default PlaylistInfosModalForm;

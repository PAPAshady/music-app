import { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {
  removeAllNotifications,
  removeNotification,
  timeAgo,
} from '../../../redux/slices/notificationsSlice';
import { Clock } from 'iconsax-reactjs';

export default function NotificationMenu({ isVisible, classNames }) {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const clearAllNotifications = (e) => {
    e.stopPropagation(); // stops the menu from closing when user clicks on the button.
    dispatch(removeAllNotifications());
  };

  return (
    <div
      className={`bg-primary-800/60 absolute right-[60%] z-10 w-87.5 rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 ${isVisible ? 'visible top-[130%] opacity-100' : 'invisible top-[200%] opacity-0'} ${classNames}`}
    >
      <div className="mb-4 flex items-center justify-between gap-14.5">
        <p className="text-primary-300 text-lg">Notifications</p>
        {!!notifications.length && (
          <button className="text-white-500 text-sm text-nowrap" onClick={clearAllNotifications}>
            Mark all as read
          </button>
        )}
      </div>
      <div className="flex max-h-75 flex-col overflow-y-auto p-3">
        {notifications.length ? (
          <>
            {notifications.map((notification) => (
              <Notification key={notification.id} {...notification} />
            ))}
          </>
        ) : (
          <p className="text-primary-200 text-center">No notifications</p>
        )}
      </div>
    </div>
  );
}

const Notification = memo(({ text, createdAt, id }) => {
  const dispatch = useDispatch();

  const clearNotification = (e) => {
    e.stopPropagation(); // stops the menu from closing when user clicks on a notification.
    dispatch(removeNotification(id));
  };

  return (
    <div
      title="Click to mark as seen"
      className="border-primary-300 cursor-pointer not-first-of-type:mt-4 not-first-of-type:border-t not-first-of-type:pt-4"
      onClick={clearNotification}
    >
      <div className="mb-1.5 flex gap-2">
        <span className="bg-primary-100 mt-2 size-1.5 rounded-full"></span>
        <p className="text-primary-100 before:bg-primary-100 text-sm">{text}</p>
      </div>
      <div className="flex items-center justify-end gap-1 text-end">
        <p className="text-primary-300">
          <Clock size={15} />
        </p>
        <p className="text-primary-300 text-sm">{timeAgo(createdAt)}</p>
      </div>
    </div>
  );
});

Notification.displayName = 'Notification';

NotificationMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  classNames: PropTypes.string,
};

Notification.propTypes = {
  text: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

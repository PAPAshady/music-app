import { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { notifications as notifs } from '../../../data';

export default function NotificationMenu({ isVisible, classNames }) {
  const [notifications, setNotifications] = useState(notifs);

  const clearNotifications = () => setNotifications([]);

  const handleMarkAsRead = (event, id) => {
    event.stopPropagation(); // stops the menu from closing when user clicks on a notification.
    const updatedNotifications = notifications.filter((notification) => notification.id !== id);
    setNotifications(updatedNotifications);
  };

  return (
    <div
      className={`bg-primary-800/60 absolute right-[60%] z-10 rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 ${isVisible ? 'visible top-[130%] opacity-100' : 'invisible top-[200%] opacity-0'} ${classNames}`}
    >
      <div className="mb-4 flex items-center justify-between gap-[58px]">
        <p className="text-primary-300 text-lg">Notifications</p>
        <button className="text-white-500 text-sm text-nowrap" onClick={clearNotifications}>
          Mark all as a read
        </button>
      </div>
      <div className="flex max-h-[300px] flex-col overflow-y-auto p-3">
        {notifications.length ? (
          <>
            {notifications.map((notification) => (
              <Notification key={notification.id} onClick={handleMarkAsRead} {...notification} />
            ))}
          </>
        ) : (
          <p className="text-primary-200 text-center">No notifications</p>
        )}
      </div>
    </div>
  );
}

const Notification = memo(({ body, time, id, onClick }) => {
  return (
    <div
      title="Click to mark as seen"
      className="border-primary-300 cursor-pointer not-[:first-of-type]:mt-4 not-[:first-of-type]:border-t not-[:first-of-type]:pt-4"
      onClick={(event) => onClick(event, id)}
    >
      <div className="mb-1.5 flex gap-2">
        <span className="bg-primary-100 mt-2 size-[6px] rounded-full"></span>
        <p className="text-primary-100 before:bg-primary-100 text-sm">{body}</p>
      </div>
      <p className="text-primary-300 text-end text-sm">{time}</p>
    </div>
  );
});

Notification.displayName = 'Notification';

NotificationMenu.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  classNames: PropTypes.string,
};

Notification.propTypes = {
  body: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

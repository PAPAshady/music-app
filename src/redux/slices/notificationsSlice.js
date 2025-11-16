import { createSlice } from '@reduxjs/toolkit';

export const timeAgo = (date) => {
  const time = +new Date(date).getTime();
  const diff = +new Date() - time;

  const seconds = Math.floor(diff / 1000);
  const mintues = Math.floor(seconds / 60);
  const hours = Math.floor(mintues / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (diff < 1000) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  if (mintues < 60) return `${mintues}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${seconds}d ago`;
  return `${weeks}w ago`;
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: [],
  reducers: {
    addNotification: (state, action) => {
      const newNotification = {
        id: crypto.randomUUID(),
        text: action.payload,
        createdAt: new Date().toISOString(),
      };
      return [...state, newNotification];
    },
    removeNotification: (state, action) => {
      return state.filter((notification) => notification.id !== action.payload);
    },
    removeAllNotifications: () => [],
  },
});

export default notificationsSlice.reducer;
export const { addNotification, removeNotification, removeAllNotifications } =
  notificationsSlice.actions;

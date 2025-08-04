import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setUser } from './slices/authSlice';
import { getUserAvatar } from './slices/authSlice';

const listenerMiddleware = createListenerMiddleware();

// Previously, if a user logged out and logged in again with a different account,
// their avatar wouldn't update. This listener ensures the avatar is refreshed when the user changes.
listenerMiddleware.startListening({
  actionCreator: setUser,
  effect: (action, { dispatch }) => {
    const userId = action.payload?.id;
    userId && dispatch(getUserAvatar(userId));
  },
});

export default listenerMiddleware;

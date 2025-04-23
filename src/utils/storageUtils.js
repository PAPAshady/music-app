export const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

export const setToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export const removeFromLocalStorage = (key) => localStorage.removeItem(key);

export const clearLocalStorage = () => localStorage.clear();

export const getCookies = () => {
  const cookies = document.cookie;
  if (!cookies) return {};
  return cookies.split('; ').reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    acc[key] = value;
    return acc;
  }, {});
};

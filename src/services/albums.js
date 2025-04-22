import api from './api';

export const getAlbumByTitle = async (albumName) => {
  const { data } = await api.get(`/album/${albumName}/`);
  return data;
};

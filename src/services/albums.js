import api from './api';

export const getAlbumByTitle = async (albumName) => {
  const { data } = await api.get(`/album/${albumName}/`);
  return data;
};

export const getAllAlbums = async () => {
  const { data } = await api.get('/album/albums/');
  return data;
};

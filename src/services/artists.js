import api from './api';

export const getArtists = async () => {
  const { data } = await api.get('/artist/artists/');
  return data;
};

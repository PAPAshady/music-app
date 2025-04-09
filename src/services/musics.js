import api from './api';

export const getMusicsByArtist = async (name) => {
  const { data } = await api.get(`/music/artist/${name}`);
  return data;
};

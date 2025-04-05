import api from './axiosInstance';

export const getArtists = async () => {
  const artistsInfos = await api.get('/artist/artists/');
  return artistsInfos.data;
};

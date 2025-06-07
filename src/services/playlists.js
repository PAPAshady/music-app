import api from './api';

export const addPlaylist = async (playlistData) => {
  const playlist = new FormData();
  for (let prop in playlistData) {
    if (prop === 'music_id') {
      playlistData[prop].map((musicId) => playlist.append(prop, musicId));
    } else {
      playlist.append(prop, playlistData[prop]);
    }
  }
  const { data } = await api.post('/playlist/add/', playlist);
  return data;
};

export const getUserPlaylists = async () => {
  const { data } = await api.get('/playlist/playlists/');
  return data;
};

export const addMusicToPlaylist = async ({ playlistId, musicId }) => {
  const newMusicInfos = new FormData();
  newMusicInfos.append('id', playlistId);
  newMusicInfos.append('music_id', musicId);
  return await api.patch('/playlist/addmusic/', newMusicInfos);
};

export const removeMusicFromPlaylist = async ({ playlistId, musicId }) => {
  const newMusicInfos = new FormData();
  newMusicInfos.append('id', playlistId);
  newMusicInfos.append('music_id', musicId);
  return await api.patch('/playlist/removemusic/', newMusicInfos);
};

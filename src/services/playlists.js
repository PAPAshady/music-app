import supabase from './supabaseClient';

export const getAllPlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists_with_count')
    .select('*')
    .order('title', { ascending: true });
  if (error) throw error; // other errors will be handled with react query or another try-catch block.
  return data;
};

export const getAllPublicPlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists_with_count')
    .select('*')
    .eq('is_public', true)
    .order('title', { ascending: true });
  if (error) throw error;
  return data;
};

export const getAllPrivatePlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists_with_count')
    .select('*')
    .eq('is_public', false)
    .order('title', { ascending: true });
  if (error) throw error;
  return data;
};

export const createNewPrivatePlaylist = async (playlistInfos) => {
  const newPlaylist = {
    is_public: false,
    tracklistType: 'playlist',
    ...playlistInfos,
  };

  const { data, error } = await supabase.from('playlists').insert(newPlaylist).select();
  if (error) throw error; // other errors will be handled with react query or another try-catch block.
  return data;
};

export const updatePrivatePlaylist = async (playlistId, newData) => {
  const { data, error } = await supabase
    .from('playlists')
    .update(newData)
    .eq('id', playlistId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deletePrivatePlaylist = async (playlistId) => {
  const { data, error } = await supabase.from('playlists').delete().eq('id', playlistId).select();
  if (error) throw error;
  return data;
};

export const addSongToPrivatePlaylist = async (playlist_id, song_id) => {
  const { data, error } = await supabase
    .from('playlist_songs')
    .insert({ playlist_id, song_id })
    .select();
  if (error) throw error;
  return data;
};

export const removeSongFromPrivatePlaylist = async (playlistId, songId) => {
  const { data, error } = await supabase
    .from('playlist_songs')
    .delete()
    .eq('song_id', songId)
    .eq('playlist_id', playlistId)
    .select();
  if (error) throw error;
  return data;
};

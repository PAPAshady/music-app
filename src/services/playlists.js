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

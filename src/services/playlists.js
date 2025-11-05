import supabase from './supabaseClient';

export const getAllPlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists_extended')
    .select('*')
    .order('title', { ascending: true });
  if (error) throw error; // other errors will be handled with react query or another try-catch block.
  return data;
};

export const getAllPublicPlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists_extended')
    .select('*')
    .eq('is_public', true)
    .order('title', { ascending: true });
  if (error) throw error;
  return data;
};

export const getAllPrivatePlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists_extended')
    .select('*')
    .eq('is_public', false)
    .order('title', { ascending: true });
  if (error) throw error;
  return data;
};

export const getPlaylistById = async (playlistId) => {
  const { data, error } = await supabase
    .from('playlists_extended')
    .select('*')
    .eq('id', playlistId)
    .maybeSingle();
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

export const getFavoritePlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists_extended')
    .select('*')
    .eq('is_liked', true);
  if (error) throw error;
  return data;
};

export const getTrendingPlaylists = async () => {
  const { data, error } = await supabase.from('most_played_playlists').select('*').limit(10);
  if (error) throw error;
  return data;
};

export const getRecommendedPlaylists = async () => {
  const { data, error } = await supabase.from('recommended_playlists').select('*').limit(10);
  if (error) throw error;
  return data;
};

export const getPlaylistsByGenre = async (genreId) => {
  const { data, error } = await supabase
    .from('playlists_extended')
    .select('*')
    .match({ genre_id: genreId, is_public: true });
  if (error) throw error;
  return data;
};

export const getUserSubscribedPlaylists = async () => {
  const { data, error } = await supabase.from('user_subscribed_playlists').select('*');
  if (error) throw error;
  return data;
};

export const subscribeToPlaylist = async (playlistId) => {
  const { data, error } = await supabase
    .from('playlist_subscriptions')
    .insert({ playlist_id: playlistId })
    .select();
  if (error) throw error;
  return data;
};

export const unsubscribeFromPlaylist = async (playlistId, userId) => {
  const { data, error } = await supabase
    .from('playlist_subscriptions')
    .delete()
    .match({ playlist_id: playlistId, user_id: userId })
    .select();
  if (error) throw error;
  return data;
};

export const getRecentlyPlayedPlaylists = async () => {
  const { data, error } = await supabase.from('recent_playlists').select('*').limit(10);
  if (error) throw error;
  return data;
};

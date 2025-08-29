import supabase from './supabaseClient';

export const getAllSongs = async ({ limit, cursor }) => {
  let query = supabase
    .from('songs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getSongsByAlbumId = async (albumId) => {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq(`album_id`, albumId)
    .order('track_number', { ascending: true });
  if (error) throw error;
  return data;
};

export const getSongsByPlaylistId = async (playlistId) => {
  const { data, error } = await supabase
    .from('playlist_songs')
    .select('songs(*)')
    .eq('playlist_id', playlistId);
  if (error) throw error;
  return data.map((data) => data.songs);
};

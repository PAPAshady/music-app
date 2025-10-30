import supabase from './supabaseClient';

export const likeSong = async (songId) => {
  const { data, error } = await supabase
    .from('likes')
    .upsert(
      { target_id: songId, target_type: 'song' },
      { onConflict: ['user_id', 'target_id', 'target_type'] }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const unlikeSong = async (songId, userId) => {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .match({ target_id: songId, user_id: userId, target_type: 'song' })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const likePlaylist = async (playlistId) => {
  const { data, error } = await supabase
    .from('likes')
    .upsert(
      { target_id: playlistId, target_type: 'playlist' },
      { onConflict: ['user_id', 'target_id', 'target_type'] }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const unlikePlaylist = async (playlistId, userId) => {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .match({ target_id: playlistId, user_id: userId, target_type: 'playlist' })
    .select()
    .single();
  if (error) throw error;
  return data;
};

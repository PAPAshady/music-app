import supabase from './supabaseClient';

export const likeSong = async (songId) => {
  const { data, error } = await supabase
    .from('likes')
    .upsert({ song_id: songId }, { onConflict: ['user_id', 'song_id'] })
    .select();
  if (error) throw error;
  return data;
};

export const unlikeSong = async (songId, userId) => {
  const { data, error } = await supabase
    .from('likes')
    .delete()
    .match({ song_id: songId, user_id: userId });
  if (error) throw error;
  return data;
};

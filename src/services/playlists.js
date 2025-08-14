import supabase from './supabaseClient';

export const getAllPlaylists = async () => {
  const { data, error } = await supabase
    .from('playlists_with_count')
    .select('*')
    .order('title', { ascending: true });
  if (error) throw error; // other errors will be handled with react query or another try-catch block.
  return data;
};

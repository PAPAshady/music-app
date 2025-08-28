import supabase from './supabaseClient';

export const getArtists = async () => {
  const { data, error } = await supabase.from('artists').select('*');
  if (error) throw error;
  return data;
};

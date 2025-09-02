import supabase from './supabaseClient';

export const getArtists = async () => {
  const { data, error } = await supabase.from('artists').select('*');
  if (error) throw error;
  return data;
};

export const getArtistById = async (artistId) => {
  const { data, error } = await supabase.from('artists').select('*').eq('id', artistId).single();
  if (error) throw error;
  return data;
};

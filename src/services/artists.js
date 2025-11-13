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

export const getRelatedArtists = async (artist) => {
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('genre_id', artist.genre_id)
    .neq('id', artist.id)
    .limit(10);
  if (error) throw error;
  return data;
};

export const getTrendingArtists = async () => {
  const { data, error } = await supabase.from('trending_artists').select('*').limit(10);
  if (error) throw error;
  return data;
};

export const getArtistsByKeyword = async (keyword) => {
  const { data, error } = await supabase
    .from('trending_artists')
    .select('*')
    .ilike('name', `%${keyword}%`)
    .order('total_plays', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
};

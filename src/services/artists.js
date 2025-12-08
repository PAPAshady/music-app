import supabase from './supabaseClient';

export const getArtists = async ({ limit }) => {
  let query = supabase.from('artists').select('*');
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
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

export const getArtistsByKeyword = async (keyword, { limit = 10 } = {}) => {
  const { data, error } = await supabase
    .from('trending_artists')
    .select('*')
    .ilike('name', `%${keyword}%`)
    .order('total_plays', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

import supabase from './supabaseClient';

export const getGenreById = async (genreId) => {
  const { data, error } = await supabase.from('genres').select('*').eq('id', genreId).single();
  if (error) throw error;
  return data;
};

export const getAllGenres = async () => {
  const { data, error } = await supabase.from('genres').select('*');
  if (error) throw error;
  return data;
};

// this function returns user top genres. if user has no top genres, it will just return a list of genres with no exact oreder.
export const getUserTopGenres = async () => {
  const { data, error } = await supabase
    .from('user_top_genres')
    .select('*')
    .order('total_plays', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
};

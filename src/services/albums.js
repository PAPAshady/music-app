import supabase from './supabaseClient';

export const getAllAlbums = async () => {
  const { data, error } = await supabase
    .from('albums_extended')
    .select('*')
    .order('title', { ascending: true });
  if (error) throw error; // other errors will be handled with react query or another try-catch block.
  return data;
};

export const getAlbumById = async (albumId) => {
  const { data, error } = await supabase
    .from('albums_extended')
    .select('*')
    .eq('id', albumId)
    .single();
  if (error) throw error;
  return data;
};

export const getAlbumsByArtistId = async (artistId) => {
  const { data, error } = await supabase.from('albums').select('*').eq('artist_id', artistId);
  if (error) throw error;
  return data;
};

export const getFavoriteAlbums = async () => {
  const { data, error } = await supabase.from('albums_extended').select('*').eq('is_liked', true);
  if (error) throw error;
  return data;
};

export const getTrendingAlbums = async () => {
  const { data, error } = await supabase.from('most_played_albums').select('*').limit(10);
  if (error) throw error;
  return data;
};

export const recommendAlbums = async () => {
  const { data, error } = await supabase.from('recommended_albums').select('*').limit(10);
  if (error) throw error;
  return data;
};
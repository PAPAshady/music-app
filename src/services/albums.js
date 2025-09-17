import supabase from './supabaseClient';

export const getAllAlbums = async () => {
  const { data, error } = await supabase
    .from('album_with_total_tracks')
    .select('*')
    .order('title', { ascending: true });
  if (error) throw error; // other errors will be handled with react query or another try-catch block.
  return data;
};

export const getAlbumsByArtistId = async (artistId) => {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('artist_id', artistId);
  if (error) throw error;
  return data;
};

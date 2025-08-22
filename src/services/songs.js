import supabase from './supabaseClient';

const handleSongsErrors = (err) => {
  if (err.code === 'PGRST116') {
    return { status: 'not_found', success: true, songs: [] };
  } else {
    throw err; // other errors will be handled with react query or another try-catch block.
  }
};

export const getAllSongs = async () => {
  const { data, error } = await supabase.from('songs').select('*');
  if (error) throw error;
  return data;
};

export const getSongsByAlbumId = async (albumId) => {
  try {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .eq(`album_id`, albumId)
      .order('title', { ascending: true });
    if (error) throw error;
    return data;
  } catch (err) {
    return handleSongsErrors(err);
  }
};

export const getSongsByPlaylistId = async (playlistId) => {
  const { data, error } = await supabase
    .from('playlist_songs')
    .select('songs(*)')
    .eq('playlist_id', playlistId);
  if (error) throw error;
  return data.map((data) => data.songs);
};

// Fetch songs that contain at least one of the specified genres in their genre array.
export const getSongsByGenres = async (genresArray) => {
  if (!genresArray || !genresArray.length) {
    return { status: 'no_genres_provided', success: false, songs: null };
  }

  try {
    const { error, data: songs } = await supabase
      .from('songs')
      .select('*')
      .or(genresArray.map((genre) => `genres.cs.{${genre.toLowerCase()}}`).join(','));
    if (error) throw error;
    return { status: 'success', success: true, songs };
  } catch (err) {
    return handleSongsErrors(err);
  }
};

export const getSongsBy = async (queryObject) => {
  try {
    const { error, data: songs } = await supabase.from('songs').select('*').match(queryObject);
    if (error) throw error;
    return { status: 'success', success: true, songs };
  } catch (err) {
    return handleSongsErrors(err);
  }
};

export const getSingleSong = async (queryObject) => {
  try {
    const { error, data } = await supabase.from('songs').select('*').match(queryObject).single();
    if (error) throw error;
    return { status: 'success', success: true, song: data };
  } catch (err) {
    // expected 1 result, but found none/multiple result(s)
    if (err.code === 'PGRST116') {
      if (err.details === 'The result contains 0 rows') {
        return { status: 'not_found', success: true, song: null };
      } else {
        return { status: 'multiple_results', success: false, song: null };
      }
    } else {
      throw err;
    }
  }
};

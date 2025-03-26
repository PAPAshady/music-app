import supabase from './supabaseClient';

export const getAllSongs = async () => {
  try {
    const { data, error } = await supabase.from('songs').select('*');
    if (error) throw error;
    return data;
  } catch (err) {
    if (err.code === 'PGRST116') {
      return null; // if no data found, return null instead of throwing an error
    } else {
      throw err; // other errors will be handled with react query or another try-catch block.
    }
  }
};

export const getSongsByAlbum = async (albumName, artist) => {
  try {
    const { error, data } = await supabase
      .from('songs')
      .select('*')
      .eq('artist', artist)
      .eq('album', albumName);
    if (error) throw error;
    return data;
  } catch (err) {
    if (err.code === 'PGRST116') {
      return null;
    } else {
      throw err;
    }
  }
};

// Fetche songs that contain at least one of the specified genres in their genre array.
export const getSongsByGenres = async (genresArray) => {
  if (!genresArray.length) return null;

  try {
    const { error, data } = await supabase
      .from('songs')
      .select('*')
      .or(genresArray.map((genre) => `genres.cs.{${genre.toLowerCase()}}`).join(','));
    if (error) throw error;
    return data;
  } catch (err) {
    if (err.code === 'PGRST116') {
      return null;
    } else {
      throw err;
    }
  }
};

export const getSingleSong = async (columnName, columnValue) => {
  try {
    const { error, data } = await supabase
      .from('songs')
      .select('*')
      .eq(columnName, columnValue)
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    if (err.code === 'PGRST116') {
      return null;
    } else {
      throw err;
    }
  }
};

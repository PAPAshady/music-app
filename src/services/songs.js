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

export const getSongsBy = async (columnName, columnValue) => {
  try {
    const { error, data } = await supabase.from('songs').select('*').eq(columnName, columnValue);
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

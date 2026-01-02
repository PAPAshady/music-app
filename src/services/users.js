import supabase from './supabaseClient';

export const getUser = async (userId) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return user;
  } catch (err) {
    // if no data found, return null instead of throwing an error
    if (err.code === 'PGRST116') {
      return null;
    } else {
      console.error('Error finding user: ', err);
      throw err; // error will be handled with react query or another try-catch block.
    }
  }
};

export const addUser = async (user) => {
  const { error, data } = await supabase.from('users').insert([user]).select();
  if (error) throw error;
  return data;
};

export const updateUser = async (userId, newUserInfos) => {
  const { data, error } = await supabase
    .from('users')
    .update(newUserInfos)
    .eq('id', userId)
    .select();
  if (error) throw error;
  return data;
};

export const getUserAvatarUrl = async (userId) => {
  try {
    const { data, error } = await supabase.from('users').select('avatar').eq('id', userId).single();
    if (error) throw error;
    return data.avatar;
  } catch (err) {
    if (err.code === 'PGRST116') {
      return null;
    } else {
      console.error('Error fetching user avatar: ', err);
    }
  }
};

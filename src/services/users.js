import supabase from './supabaseClient';

export const getUser = async (userAuthId) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', userAuthId)
    .single();
  if (error) throw error; // error will be handled with react query or another try-catch block.
  return user;
};

export const addUser = async (user) => {
  const { error, data } = await supabase.from('users').insert([user]).select();
  if (error) throw error;
  return data;
};

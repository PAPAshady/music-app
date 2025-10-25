import supabase from './supabaseClient';

export const globalSearch = async (query, filter) => {
  const { data, error } = await supabase.rpc('global_search', {
    query,
    filter: filter === 'all' ? null : filter,
  });

  if (error) throw error;
  return data;
};

import supabase from './supabaseClient';

export async function uploadFile(bucket, path, file) {
  const fileExtension = file.name.split('.').pop();
  const result = await supabase.storage
    .from(bucket)
    .upload(`${path}.${fileExtension}`, file, { upsert: true });
  return result;
}

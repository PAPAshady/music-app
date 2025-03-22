import supabase from './supabaseClient';

export async function uploadFile(bucket, path, file) {
  const fileExtension = file.name.split('.').pop();
  const result = await supabase.storage
    .from(bucket)
    .upload(`${path}.${fileExtension}`, file, { upsert: true });
  return result;
}

export async function listFiles(bucket, path, limit, offset, searchQuery) {
  const result = await supabase.storage
    .from(bucket)
    .list(path, { limit, offset, search: searchQuery });
  return result;
}

export async function deleteFiles(bucket, paths) {
  const result = await supabase.storage.from(bucket).remove([...paths]);
  return result;
}

export async function deleteFolderContents(bucket, folder) {
  const { data: filesList, error: filesListError } = await listFiles(bucket, folder);

  if (filesListError) {
    console.error('Error listing files in folder: ', filesListError);
    return { success: false, error: filesListError };
  }

  // no files found, folder may already be empty.
  if (!filesList || !filesList.length) {
    return { success: true, message: 'No files found in folder or bucket.' };
  }

  const filePaths = filesList.map((file) => `${folder}/${file.name}`);

  const { error: deleteError } = await supabase.storage.from(bucket).remove(filePaths);

  if (deleteError) {
    console.error('Error deleting files in folder: ', deleteError);
    return { success: false, error: deleteError };
  }

  return { success: true, message: 'All files deleted successfully.' };
}

export function getFileUrl(bucket, path) {
  const result = supabase.storage.from(bucket).getPublicUrl(path);
  return result.data.publicUrl;
}

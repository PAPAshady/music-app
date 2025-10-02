import supabase from './supabaseClient';
import { shuffleArray } from '../utils/arrayUtils';

export const getAllSongs = async ({ limit, cursor }) => {
  let query = supabase
    .from('songs_with_user_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt('created_at', cursor);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getSongsByAlbumId = async (albumId) => {
  const { data, error } = await supabase
    .from('songs_with_user_data')
    .select('*')
    .eq(`album_id`, albumId)
    .order('track_number', { ascending: true });
  if (error) throw error;
  return data;
};

export const getSongsByPlaylistId = async (playlistId) => {
  const { data, error } = await supabase
    .from('playlist_songs')
    .select('songs(*)')
    .eq('playlist_id', playlistId);
  if (error) throw error;
  return data.map((data) => data.songs);
};

export const getPopularSongsByArtistId = async (artistId) => {
  const { data, error } = await supabase
    .from('songs_with_user_data')
    .select('*')
    .eq('artist_id', artistId)
    .order('play_count', { ascending: false })
    .limit(10);
  if (error) throw error;
  return data;
};

export const getRelatedSongsBySongData = async (song) => {
  const [artistRes, genresRes] = await Promise.all([
    supabase
      .from('songs_with_user_data')
      .select('*')
      .eq('artist_id', song.artist_id)
      .neq('id', song.id)
      .limit(10),
    supabase
      .from('songs_with_user_data')
      .select('*')
      .overlaps('genres', song.genres)
      .neq('id', song.id)
      .neq('artist_id', song.artist_id)
      .limit(10),
  ]);

  if (artistRes.error) {
    console.error('Error getting related songs by artist : ', artistRes.error);
    throw artistRes.error;
  } else if (genresRes.error) {
    console.error('Error getting related songs by genre : ', genresRes.error);
    throw genresRes.error;
  }

  const relatedSongs = shuffleArray([...(artistRes.data || []), ...(genresRes.data || [])]);
  return [song, ...relatedSongs];
};

export const getFavoriteSongs = async () => {
  const { data, error } = await supabase
    .from('songs_with_user_data')
    .select('*')
    .eq('is_liked', true);
  if (error) throw error;
  return data;
};

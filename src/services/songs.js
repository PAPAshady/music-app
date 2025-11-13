import supabase from './supabaseClient';
import { shuffleArray } from '../utils/arrayUtils';

export const getAllSongs = async ({ limit, cursor }) => {
  let query = supabase
    .from('songs_extended')
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

export const getSongById = async (songId) => {
  const { data, error } = await supabase
    .from('songs_extended')
    .select('*')
    .eq('id', songId)
    .single();
  if (error) throw error;
  return data;
};

export const getSongsByAlbumId = async (albumId) => {
  const { data, error } = await supabase
    .from('songs_extended')
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
    .from('songs_extended')
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
      .from('songs_extended')
      .select('*')
      .eq('artist_id', song.artist_id)
      .neq('id', song.id)
      .limit(10),
    supabase
      .from('songs_extended')
      .select('*')
      .eq('genre_id', song.genre_id)
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
  const { data, error } = await supabase.from('songs_extended').select('*').eq('is_liked', true);
  if (error) throw error;
  return data;
};

export const getRecommendedSongs = async () => {
  const { data, error } = await supabase.from('recommended_songs').select('*').limit(20);
  if (error) throw error;
  return data;
};

export const getTrendingSongs = async () => {
  const { data, error } = await supabase.from('most_played_songs').select('*').limit(20);
  if (error) throw error;
  return data;
};

export const getRecentSongs = async () => {
  const { data, error } = await supabase.from('recent_songs').select('*').limit(20);
  if (error) throw error;
  return data;
};

export const getSongsByGenreId = async (genreId, limit) => {
  let query = supabase.from('songs_extended').select('*').eq('genre_id', genreId);

  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

export const getSongsByKeyword = async (keyword, { limit = 10 } = {}) => {
  const { data, error } = await supabase
    .from('most_played_songs')
    .select('*')
    .or(`title.ilike.%${keyword}%,artist.ilike.%${keyword}%,genre_name.ilike.%${keyword}%`)
    .order('total_plays', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
};

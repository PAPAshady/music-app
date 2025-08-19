import { queryOptions } from '@tanstack/react-query';
import queryClient from '../queryClient';
import {
  getAllPlaylists,
  getAllPrivatePlaylists,
  getAllPublicPlaylists,
  createNewPrivatePlaylist,
  updatePrivatePlaylist,
  addSongToPrivatePlaylist,
} from '../services/playlists';

export const getAllPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists'],
    queryFn: getAllPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getAllPublicPlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_public: true }],
    queryFn: getAllPublicPlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const getAllPrivatePlaylistsQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_public: false }],
    queryFn: getAllPrivatePlaylists,
    staleTime: Infinity,
    retry: true,
    retryDelay: 5000,
  });
};

export const createNewPrivatePlaylistQueryOptions = () => {
  return queryOptions({
    queryKey: ['playlists', { is_public: false }],
    mutationFn: (data) => createNewPrivatePlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', { is_public: false }] });
    },
  });
};

export const updatePrivatePlaylistQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ['playlists', { is_public: false, playlistId }],
    mutationFn: (newData) => updatePrivatePlaylist(playlistId, newData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', { is_public: false }] });
    },
  });
};

export const addSongToPrivatePlaylistQueryOptions = (playlistId) => {
  return queryOptions({
    queryKey: ['playlists', { is_public: false, playlistId }],
    mutationFn: (songId) => addSongToPrivatePlaylist(playlistId, songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists', { playlistId }] });
    },
  });
};

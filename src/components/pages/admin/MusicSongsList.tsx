"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { LastListenedSong } from "@/types";

// Import ListItem type from ItemList component
type ListItem = Parameters<typeof ItemList>[0]["items"][0];

interface MusicSongsListProps {
  songs: LastListenedSong[];
  onEdit: (song: LastListenedSong) => void;
  onDelete: (song: LastListenedSong) => void;
  onToggleVisibility?: (song: LastListenedSong) => void;
  isLoading?: boolean;
}

export const MusicSongsList: React.FC<MusicSongsListProps> = ({
  songs,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading = false,
}) => {
  const items = songs.map((item) => ({
    id: item.id,
    title: item.title,
    description: `${item.artist}${item.album ? ` - ${item.album}` : ""}`,
    image: undefined, // Songs don't have images
    status: undefined, // No status for songs
    visible: item.visible ?? undefined,
    featured: false, // Songs don't have featured field
    metadata: {
      artist: item.artist,
      album: item.album,
      spotifyUrl: item.spotifyUrl,
      youtubeUrl: item.youtubeUrl,
    },
  }));

  // Create a mapping from item ID back to song object
  const songsMap = new Map(songs.map((item) => [item.id, item]));

  const handleEdit = (listItem: ListItem) => {
    const songItem = songsMap.get(listItem.id);
    if (songItem) {
      onEdit(songItem);
    }
  };

  const handleDelete = (listItem: ListItem) => {
    const songItem = songsMap.get(listItem.id);
    if (songItem) {
      onDelete(songItem);
    }
  };

  const handleToggleVisibility = (listItem: ListItem) => {
    if (onToggleVisibility) {
      const songItem = songsMap.get(listItem.id);
      if (songItem) {
        onToggleVisibility(songItem);
      }
    }
  };

  return (
    <ItemList
      items={items}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleVisibility={handleToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No songs found"
    />
  );
};

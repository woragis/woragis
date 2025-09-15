"use client";

import React from "react";
import { ItemList } from "@/components/common";
import type { LastListenedSong } from "@/types";

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
    visible: item.visible,
    featured: false, // Songs don't have featured field
    metadata: {
      artist: item.artist,
      album: item.album,
      spotifyUrl: item.spotifyUrl,
      youtubeUrl: item.youtubeUrl,
    },
  }));

  return (
    <ItemList
      items={items}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggleVisibility={onToggleVisibility}
      isLoading={isLoading}
      emptyMessage="No songs found"
    />
  );
};

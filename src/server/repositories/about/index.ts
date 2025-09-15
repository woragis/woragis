// Export all about repositories
export { AboutCoreRepository } from "./core.repository";
export {
  MusicGenreRepository,
  LastListenedSongRepository,
} from "./music.repository";
export { AnimeRepository } from "./anime.repository";
export { BookRepository } from "./books.repository";
export { PoliticalViewRepository } from "./politics.repository";
export { YoutuberRepository } from "./youtubers.repository";
export { GameRepository } from "./games.repository";

// Note: Singleton instances are created in the main repositories index to avoid circular dependencies

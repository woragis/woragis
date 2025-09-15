// Export all about services
export { AboutCoreService } from "./core.service";
export { MusicGenreService, LastListenedSongService } from "./music.service";
export { AnimeService } from "./anime.service";
export { BookService } from "./books.service";
export { GameService } from "./games.service";
export { PoliticalViewService } from "./politics.service";
export { YoutuberService } from "./youtubers.service";

// Note: Singleton instances are created in the main services index to avoid circular dependencies

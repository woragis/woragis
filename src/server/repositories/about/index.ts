// Export all about repositories
export { BiographyRepository } from "./biography.repository";
export {
  MusicGenreRepository,
  LastListenedSongRepository,
} from "./music.repository";
export { AnimeRepository } from "./anime.repository";
export { BookRepository } from "./books.repository";
export { PoliticalViewRepository } from "./politics.repository";
export { YoutuberRepository } from "./youtubers.repository";
export { GameRepository } from "./games.repository";
export { InstrumentsRepository } from "./instruments.repository";
export { MartialArtsRepository } from "./martial-arts.repository";
export { LanguagesRepository } from "./languages.repository";
export { HobbiesRepository } from "./hobbies.repository";

// Note: Singleton instances are created in the main repositories index to avoid circular dependencies

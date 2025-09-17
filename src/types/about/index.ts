// Export all about types
export * from "./core";
export * from "./biography";
export * from "./music";
export * from "./anime";
export * from "./books";
export * from "./politics";
export * from "./youtubers";
export * from "./games";

// Export instruments with renamed conflicting types
export type { 
  Instrument,
  NewInstrument,
  LearningStatus as InstrumentLearningStatus, 
  KnowledgeLevel as InstrumentKnowledgeLevel 
} from "./instruments";

// Export martial-arts with renamed conflicting types
export type { 
  MartialArt,
  NewMartialArt,
  LearningStatus as MartialArtLearningStatus, 
  KnowledgeLevel as MartialArtKnowledgeLevel 
} from "./martial-arts";

export * from "./languages";
export * from "./hobbies";

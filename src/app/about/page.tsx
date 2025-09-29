"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublicBiography } from "@/hooks/about/useBiography";
import {
  usePublicMusicGenres,
  usePublicLastListenedSongs,
} from "@/hooks/about/useMusic";
import { usePublicAnime } from "@/hooks/about/useAnime";
import { usePublicBooks } from "@/hooks/about/useBooks";
import { usePublicGames } from "@/hooks/about/useGames";
import { usePublicPoliticalViews } from "@/hooks/about/usePolitics";
import { usePublicYoutubers } from "@/hooks/about/useYoutubers";
import { Card, Container, Button } from "@/components/ui";
import {
  Music,
  BookOpen,
  Gamepad2,
  Tv,
  Users,
  Heart,
  ChevronUp,
} from "lucide-react";

export default function AboutPage() {
  const { t } = useLanguage();
  const { data: biography, isLoading: aboutLoading } = usePublicBiography();
  const { data: musicGenres, isLoading: musicLoading } = usePublicMusicGenres();
  const { data: lastSongs, isLoading: songsLoading } =
    usePublicLastListenedSongs();
  const { data: anime, isLoading: animeLoading } = usePublicAnime();
  const { data: books, isLoading: booksLoading } = usePublicBooks();
  const { data: games, isLoading: gamesLoading } = usePublicGames();
  const { data: politicalViews, isLoading: politicsLoading } =
    usePublicPoliticalViews();
  const { data: youtubers, isLoading: youtubersLoading } = usePublicYoutubers();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const isLoading =
    aboutLoading ||
    musicLoading ||
    songsLoading ||
    animeLoading ||
    booksLoading ||
    gamesLoading ||
    politicsLoading ||
    youtubersLoading;

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveSection(sectionId);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigationItems = [
    { id: "profession", label: "Profession", icon: Users },
    { id: "biography", label: "Biography", icon: BookOpen },
    { id: "music", label: "Music Taste", icon: Music },
    { id: "anime", label: "Anime", icon: Tv },
    { id: "books", label: "Books", icon: BookOpen },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "politics", label: "Politics", icon: Heart },
    { id: "youtubers", label: "YouTubers", icon: Tv },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!biography) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">About</h1>
          <p className="mt-4 text-gray-600">No about information available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Sidebar */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "primary" : "ghost"}
                size="sm"
                onClick={() => scrollToSection(item.id)}
                className="w-full justify-start text-sm"
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-4 left-4 right-4 z-50">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2">
          <div className="flex space-x-1 overflow-x-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="flex-shrink-0 text-xs"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg"
        size="sm"
      >
        <ChevronUp className="w-4 h-4" />
      </Button>

      <Container className="py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {t("heading")}
          </h1>
          {biography.featuredBiography && (
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              {biography.featuredBiography}
            </p>
          )}
        </div>

        {/* Profession Section */}
        <section
          ref={(el) => {
            sectionRefs.current.profession = el;
          }}
          id="profession"
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              Current Profession
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-gray-700 leading-relaxed">
                {t("about.profession.title") ||
                  "Professional information not available."}
              </p>
            </div>
          </Card>
        </section>

        {/* Biography Section */}
        <section
          ref={(el) => {
            sectionRefs.current.biography = el;
          }}
          id="biography"
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-green-600" />
              Biography
            </h2>
            <div className="prose prose-lg max-w-none">
              {biography.fullBiography ? (
                <div className="text-gray-700 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {biography.fullBiography}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-gray-500 italic">Biography not available.</p>
              )}
            </div>
          </Card>
        </section>

        {/* Music Section */}
        <section
          ref={(el) => {
            sectionRefs.current.music = el;
          }}
          id="music"
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Music className="w-8 h-8 mr-3 text-purple-600" />
              Music Taste & Recently Heard
            </h2>

            {/* Music Genres */}
            {musicGenres && musicGenres.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Favorite Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {musicGenres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Last Listened Songs */}
            {lastSongs && lastSongs.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Recently Heard Songs
                </h3>
                <div className="space-y-3">
                  {lastSongs.slice(0, 10).map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {song.title}
                        </p>
                        <p className="text-sm text-gray-600">{song.artist}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {song.listenedAt
                          ? new Date(song.listenedAt).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!musicGenres || musicGenres.length === 0) &&
              (!lastSongs || lastSongs.length === 0) && (
                <p className="text-gray-500 italic">
                  Music information not available.
                </p>
              )}
          </Card>
        </section>

        {/* Anime Section */}
        <section
          ref={(el) => {
            sectionRefs.current.anime = el;
          }}
          id="anime"
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Tv className="w-8 h-8 mr-3 text-pink-600" />
              Anime
            </h2>
            {anime && anime.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {anime.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : item.status === "watching"
                            ? "bg-blue-100 text-blue-800"
                            : item.status === "want_to_watch"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status}
                      </span>
                      {item.currentEpisode && (
                        <span className="text-xs text-gray-500">
                          Ep {item.currentEpisode}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Anime information not available.
              </p>
            )}
          </Card>
        </section>

        {/* Books Section */}
        <section
          ref={(el) => {
            sectionRefs.current.books = el;
          }}
          id="books"
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-indigo-600" />
              Books I Read / Plan to Read
            </h2>
            {books && books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                  <div key={book.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {book.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          book.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : book.status === "reading"
                            ? "bg-blue-100 text-blue-800"
                            : book.status === "want_to_read"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {book.status}
                      </span>
                      {book.currentPage && (
                        <span className="text-xs text-gray-500">
                          Page {book.currentPage}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Books information not available.
              </p>
            )}
          </Card>
        </section>

        {/* Games Section */}
        <section
          ref={(el) => {
            sectionRefs.current.games = el;
          }}
          id="games"
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Gamepad2 className="w-8 h-8 mr-3 text-orange-600" />
              Favorite Games
            </h2>
            {games && games.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.map((game) => (
                  <div key={game.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {game.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {game.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          game.category === "current"
                            ? "bg-red-100 text-red-800"
                            : game.category === "childhood"
                            ? "bg-blue-100 text-blue-800"
                            : game.category === "planned"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {game.category}
                      </span>
                      {game.playtime && (
                        <span className="text-xs text-gray-500">
                          {game.playtime}h
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Games information not available.
              </p>
            )}
          </Card>
        </section>

        {/* Politics Section */}
        <section
          ref={(el) => {
            sectionRefs.current.politics = el;
          }}
          id="politics"
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Heart className="w-8 h-8 mr-3 text-red-600" />
              Political Views
            </h2>
            {politicalViews && politicalViews.length > 0 ? (
              <div className="space-y-4">
                {politicalViews.map((view) => (
                  <div key={view.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {view.personName}
                    </h3>
                    <p className="text-gray-700">{view.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Political views not available.
              </p>
            )}
          </Card>
        </section>

        {/* YouTubers Section */}
        <section
          ref={(el) => {
            sectionRefs.current.youtubers = el;
          }}
          id="youtubers"
          className="mb-16"
        >
          <Card className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Tv className="w-8 h-8 mr-3 text-red-600" />
              Favorite YouTubers
            </h2>
            {youtubers && youtubers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youtubers.map((youtuber) => (
                  <div key={youtuber.id} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {youtuber.channelName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {youtuber.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          youtuber.category === "current"
                            ? "bg-blue-100 text-blue-800"
                            : youtuber.category === "childhood"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {youtuber.category}
                      </span>
                      {youtuber.subscriberCount && (
                        <span className="text-xs text-gray-500">
                          {youtuber.subscriberCount} subs
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                YouTubers information not available.
              </p>
            )}
          </Card>
        </section>
      </Container>
    </div>
  );
}

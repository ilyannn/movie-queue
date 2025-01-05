import {
  convertToTMDBMovieID as convertToTMDBMovieID,
  IMDBMovieID,
  tmdb,
} from "@/lib/core/tmdb";

interface MovieDetails {
  id: number;
  language_title: string;
  original_title: string;
  overview: string;
  release_year: string;
  poster_url: URL | null;
  backdrop_url: URL | null;
  runtime_minutes: number;
  imdb_id: IMDBMovieID;
  spoken_languages: Array<{ name: string }>;
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  const source = await tmdb.getMovieDetails(convertToTMDBMovieID(id));

  return {
    id: source.id,
    language_title: source.title,
    original_title: source.original_title,
    overview: source.overview,
    release_year: source.release_date.slice(0, 4),
    poster_url: tmdb.getImageURL(source.poster_path, "w342"),
    backdrop_url: tmdb.getImageURL(source.backdrop_path, "w780"),
    runtime_minutes: source.runtime,
    imdb_id: source.imdb_id,
    spoken_languages: source.spoken_languages,
  };
};

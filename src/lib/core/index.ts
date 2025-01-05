import {
  convertToTMDBMovieID as convertToTMDBMovieID,
  tmdb,
} from "@/lib/core/tmdb";
import { HARDCORDED_LANGUAGE } from "./language";

const BASE_IMDB_URL = "https://www.imdb.com/title/";

interface MovieDetails {
  id: number;
  language_title: string;
  original_title: string;
  overview: string;
  release_year: string;
  poster_url: string | null;
  poster_small_url: string | null;
  backdrop_url: string | null;
  runtime_minutes: number;
  imdb_url: string | null;
  spoken_languages: Array<{ name: string }>;
}

export const getMovieDetails = async (id: number): Promise<MovieDetails> => {
  const source = await tmdb.getMovieDetails(
    convertToTMDBMovieID(id),
    HARDCORDED_LANGUAGE
  );

  return {
    id: source.id,
    language_title: source.title,
    original_title: source.original_title,
    overview: source.overview,
    release_year: source.release_date.slice(0, 4),
    poster_url: tmdb.getImageURL(source.poster_path, "w342"),
    poster_small_url: tmdb.getImageURL(source.poster_path, "w92"),
    backdrop_url: tmdb.getImageURL(source.backdrop_path, "w780"),
    runtime_minutes: source.runtime,
    imdb_url: source.imdb_id ? BASE_IMDB_URL + source.imdb_id : null,
    spoken_languages: source.spoken_languages,
  };
};

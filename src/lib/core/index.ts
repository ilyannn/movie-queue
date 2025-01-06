import {
  convertToTMDBMovieID as convertToTMDBMovieID,
  tmdb,
} from "@services/tmdb";
import redis from "@services/redis";

import { HARDCORDED_LANGUAGE } from "./language";
import { MovieID, type QueueID } from "./types";
import { AbstractQueueItem, addToQueue } from "./_queue";

const BASE_TMDB_URL = "https://www.themoviedb.org/movie/";
const BASE_IMDB_URL = "https://www.imdb.com/title/";

interface MovieSummary {
  id: MovieID;
  language_title: string;
  original_title: string;
  release_year: string;
  poster_url: string | null;
  poster_small_url: string | null;
}

interface MovieDetails extends MovieSummary {
  overview: string;
  backdrop_url: string | null;
  runtime_minutes: number;
  tmdb_url: string | null;
  imdb_url: string | null;
  spoken_languages: Array<{ name: string }>;
}


interface QueueDetails {
  items: Array<MovieSummary & AbstractQueueItem>;
}

export const getMovieDetails = async (
  mid: number,
  language: string = HARDCORDED_LANGUAGE
): Promise<MovieDetails> => {
  const key = `MovieDetails:${mid}:${language}`;
  const cached = await redis.get(key);

  if (typeof cached === "string") {
    return JSON.parse(cached);
  }

  const source = await tmdb.getMovieDetails(
    convertToTMDBMovieID(mid),
    HARDCORDED_LANGUAGE
  );

  const details: MovieDetails = {
    id: source.id,
    language_title: source.title,
    original_title: source.original_title,
    overview: source.overview,
    release_year: source.release_date.slice(0, 4),
    poster_url: tmdb.getImageURL(source.poster_path, "w342"),
    poster_small_url: tmdb.getImageURL(source.poster_path, "w92"),
    backdrop_url: tmdb.getImageURL(source.backdrop_path, "w780"),
    runtime_minutes: source.runtime,
    tmdb_url: BASE_TMDB_URL + source.id,
    imdb_url: source.imdb_id ? BASE_IMDB_URL + source.imdb_id : null,
    spoken_languages: source.spoken_languages,
  };

  redis.set(key, JSON.stringify(details), "EX", 60 * 60 * 24);
  return details;
};

export const getMovieQueue = async (qid: QueueID): Promise<QueueDetails> => {
  const key = `MovieQueue:${qid}`;
  const cached = await redis.get(key);

  if (typeof cached === "string") {
    return JSON.parse(cached);
  }

  return { items: [] };
};

export const addToMovieQueue = async (mid: MovieID, qid: QueueID) => {
    const key = `MovieQueue:${qid}`;
    const queue = await getMovieQueue(qid);
    
    const movie = await getMovieDetails(mid);
    const newQueue = addToQueue(queue, movie, { percent: 100});    
    redis.set(key, JSON.stringify(newQueue));
};
"use server";

import {
  convertToTMDBLanguageCodes,
  convertToTMDBMovieID as convertToTMDBMovieID,
  tmdb,
  TMDBLanguageCode,
} from "@services/tmdb";
import redis from "@services/redis";

import { MovieID, type QueueID } from "./types";
import { AbstractQueueItem, addToQueue } from "./_queue";
import { getUserQueues, QueueInfo } from "../services/backend";
import { createServerSupabaseClient } from "@services/supabase/server";
import { UUID } from "crypto";

const BASE_TMDB_URL = "https://www.themoviedb.org/movie/";
const BASE_IMDB_URL = "https://www.imdb.com/title/";

export interface MovieSummary {
  id: MovieID;
  language_title: string;
  original_title: string;
  release_year: string;
  poster_url: string | null;
  poster_small_url: string | null;
}

export interface MovieDetails extends MovieSummary {
  overview: string;
  backdrop_url: string | null;
  runtime_minutes: number;
  tmdb_url: string | null;
  imdb_url: string | null;
  spoken_languages: Array<{ name: string }>;
}

export interface QueueSummary {
  id: QueueID;
  name: string;
}
interface QueueDetails {
  items: Array<MovieSummary & AbstractQueueItem>;
}

export const getMovieDetails = async (
  mid: number,
  languages?: string | null | undefined
): Promise<MovieDetails> => {
  const key = `MovieDetails:${mid}:${languages}`;
  const cached = await redis.get(key);

  if (typeof cached === "string") {
    return JSON.parse(cached);
  }

  const languageCodes = languages ? convertToTMDBLanguageCodes(languages) : [];

  const source = await tmdb.getMovieDetails(
    convertToTMDBMovieID(mid),
    languageCodes.length > 0 ? languageCodes[0] : undefined
  );

  const id = source.id;
  let language_title = source.title;

  if (
    languageCodes.length > 0 &&
    source.original_language !== languageCodes[0] &&
    (source.title === language_title || source.title === "")
  ) {
    // Suspicious... let's check the title translations
    const translations = await tmdb.getMovieTranslations(id);
    const translated_title: Record<TMDBLanguageCode, string> =
      Object.fromEntries(languageCodes.map((lang) => [lang, ""]));

    for (const translation of translations) {
      if (
        translation.iso_639_1 in translated_title &&
        translation.data.title.length > 0
      ) {
        translated_title[translation.iso_639_1] = translation.data.title;
      }
    }

    for (const lang of languageCodes) {
      if (translated_title[lang].length > 0) {
        language_title = translated_title[lang];
        break;
      }
    }
  }

  const details: MovieDetails = {
    id,
    language_title,
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

const isUUID = (uuid: string): uuid is UUID => {
  return uuid.length === 36 && uuid[8] === "-";
};

export const getCurrentUserQueues = async (): Promise<Array<QueueInfo>> => {
  const supabase = await createServerSupabaseClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    return [];
  }
  const auth_user_uuid = user?.data.user?.id;
  if (!auth_user_uuid || !isUUID(auth_user_uuid)) {
    throw new Error("User not authenticated");
  }
  return getUserQueues(auth_user_uuid);
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
  const newQueue = addToQueue(queue, movie, { percent: 100 });
  redis.set(key, JSON.stringify(newQueue));
};

import { TMDBMovieID } from "@services/tmdb";

export type QueueID = number & { __queueID: true };
export type MovieID = TMDBMovieID;
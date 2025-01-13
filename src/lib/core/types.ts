import { TMDBMovieID } from "@services/tmdb";

export type QueueID = number & { __queueID: true };
export type UserID = number & { __userID: true };
export type MovieID = TMDBMovieID;

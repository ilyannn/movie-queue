import { convertToTDBMovieID, tmdb, TMDBMovieID } from "@/lib/core/tmdb";

export const getMovieDetails = async (id: number) => {
  return tmdb.getMovieDetails(convertToTDBMovieID(id));
};

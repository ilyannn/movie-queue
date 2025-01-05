const BASE_URL = "https://api.themoviedb.org/3";

export type TMDBMovieID = number & { __TMDBMovieID: never };
export type TMDBSeriesID = number & { __TMDBSeriesID: never };
export type TMDBImageSize = string & { __TMDBImageSize: never };
export type TMDBImagePath = string & { __TMDBImagePath: never };

export type IMDBMovieID = string & { __IMDBMovieID: never };
export type DurationInMinutes = number & { __DurationInMinutes: never };

// https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
export type ISOLanguageCode = string & { __languageCode: never };

// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
export type ISOCountryCode = string & { __countryCode: never };

// https://en.wikipedia.org/wiki/ISO_8601
export type ISODate = string & { __ISODate: never };

export const convertToTDBMovieID = (id: string | number): TMDBMovieID => {
  const n = Number(id);
  if (isNaN(n)) {
    throw new Error("Invalid IMDB ID");
  }
  return n as TMDBMovieID;
};

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: ISOCountryCode;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: ISOLanguageCode;
  name: string;
}

interface GenreInfo {
  id: number;
  name: string;
}

interface MovieDetails {
  id: TMDBMovieID;
  title: string;
  original_title: string;
  overview: string;
  release_date: ISODate;
  vote_average: number;
  vote_count: number;
  poster_path: TMDBImagePath | null;
  backdrop_path: TMDBImagePath | null;
  genres: GenreInfo[];
  runtime: DurationInMinutes;
  adult: boolean;
  belongs_to_collection: null | object;
  budget: number;
  homepage: string;
  imdb_id: IMDBMovieID;
  original_language: ISOLanguageCode;
  popularity: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  video: boolean;
}

type TMDBMovieRoutes = [] | ["translations"];
type TMDBSearchRoutes = ["movie"];
type TMDBRoute =
  | ["movie", TMDBMovieID, ...TMDBMovieRoutes]
  | ["search", ...TMDBSearchRoutes];

export class TMDBClient {
  private apiKey: string;

  constructor() {
    const token = process.env.TMDB_READ_ACCESS_TOKEN;
    if (!token) {
      console.warn("TMDB_READ_ACCESS_TOKEN is not set");
      //      throw new Error("TMDB_READ_ACCESS_TOKEN is not set");
    }
    this.apiKey = token || "";
  }

  private async fetch<T>(
    routing: TMDBRoute,
    searchParams: Record<string, string | undefined> = {}
  ): Promise<T> {
    const url = new URL([3, ...routing].join("/"), BASE_URL);
    for (const key in searchParams) {
      if (searchParams[key] !== undefined) {
        url.searchParams.set(key, searchParams[key]);
      }
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log(url, response);
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getMovieDetails(
    movieId: TMDBMovieID,
    language: ISOLanguageCode | undefined = undefined
  ): Promise<MovieDetails> {
    return this.fetch<MovieDetails>(["movie", movieId], { language });
  }

  getImageUrl(
    path: TMDBImagePath | null,
    size: TMDBImageSize | "original" = "original"
  ): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

export const tmdb = new TMDBClient();

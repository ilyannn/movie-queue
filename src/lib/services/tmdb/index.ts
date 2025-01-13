import { CONFIG } from "./config";

const API_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = CONFIG.images.secure_base_url;

export type TMDBMovieID = number & { __TMDBMovieID: never };
export type TMDBSeriesID = number & { __TMDBSeriesID: never };

export type TMDBBackdropImageSize =
  (typeof CONFIG.images.backdrop_sizes)[number];
export type TMDBLogoImageSize = (typeof CONFIG.images.logo_sizes)[number];
export type TMDBPosterImageSize = (typeof CONFIG.images.poster_sizes)[number];
export type TMDBProfileImageSize = (typeof CONFIG.images.profile_sizes)[number];
export type TMDBStillImageSize = (typeof CONFIG.images.still_sizes)[number];
export type TMDBImageSize =
  | TMDBBackdropImageSize
  | TMDBLogoImageSize
  | TMDBPosterImageSize
  | TMDBProfileImageSize
  | TMDBStillImageSize;

export type TMDBImagePath = string & { __TMDBImagePath: never };

export type IMDBMovieID = string & { __IMDBMovieID: never };
export type DurationInMinutes = number & { __DurationInMinutes: never };

// https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes
export type TMDBLanguageCode = string & { __languageCode: never };

// https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
export type TMDBCountryCode = string & { __countryCode: never };

export const TMDBCountryCodeNotSelected = "" as TMDBCountryCode;

// https://en.wikipedia.org/wiki/ISO_8601
export type ISODate = string & { __ISODate: never };

export const convertToTMDBMovieID = (id: string | number): TMDBMovieID => {
  const n = Number(id);
  if (isNaN(n)) {
    throw new Error("Invalid IMDB ID");
  }
  return n as TMDBMovieID;
};

export const convertToTMDBLanguageCodes = (
  languages: string
): TMDBLanguageCode[] => {
  return languages.split(" ").filter((x) => x != "") as TMDBLanguageCode[];
};

interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: TMDBCountryCode;
  name: string;
}

interface SpokenLanguage {
  english_name: string;
  iso_639_1: TMDBLanguageCode;
  name: string;
}

interface GenreInfo {
  id: number;
  name: string;
}

interface TMDBMovieDetails {
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
  original_language: TMDBLanguageCode;
  popularity: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  revenue: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  video: boolean;
}

interface TMDBMovieTranslation {
  iso_3166_1: TMDBCountryCode;
  iso_639_1: TMDBLanguageCode;
  name: string;
  english_name: string;
  data: {
    title: string;
    overview: string;
    homepage: string;
    tagline: string;
  };
}

type TMDBMovieTranslations = {
  translations: TMDBMovieTranslation[];
};

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
    const url = new URL([3, ...routing].join("/"), API_BASE_URL);
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
    language: TMDBLanguageCode | null = null
  ): Promise<TMDBMovieDetails> {
    const params = language ? { language: language } : {};
    return this.fetch<TMDBMovieDetails>(["movie", movieId], params);
  }

  async getMovieTranslations(
    movieId: TMDBMovieID
  ): Promise<TMDBMovieTranslation[]> {
    const result = await this.fetch<TMDBMovieTranslations>([
      "movie",
      movieId,
      "translations",
    ]);
    return result.translations;
  }

  getImageURL(
    path: TMDBImagePath | null,
    size: TMDBImageSize | "original" = "original"
  ): string | null {
    if (!path) return null;
    return [IMAGE_BASE_URL, size, path].join("/");
  }
}

export const tmdb = new TMDBClient();

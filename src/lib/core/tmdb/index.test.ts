import { convertToTMDBMovieID } from "./index";

describe("convertToTDBMovieID", () => {
  it("should convert numeric string to TMDBMovieID", () => {
    expect(convertToTMDBMovieID("123")).toBe(123);
  });

  it("should convert number to TMDBMovieID", () => {
    expect(convertToTMDBMovieID(456)).toBe(456);
  });

  it("should throw error for invalid numeric string", () => {
    expect(() => convertToTMDBMovieID("abc")).toThrow("Invalid IMDB ID");
  });

  it("should throw error for non-numeric string", () => {
    expect(() => convertToTMDBMovieID("123abc")).toThrow("Invalid IMDB ID");
  });
});

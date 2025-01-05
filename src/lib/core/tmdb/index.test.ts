import { convertToTDBMovieID } from "./index";

describe("convertToTDBMovieID", () => {
  it("should convert numeric string to TMDBMovieID", () => {
    expect(convertToTDBMovieID("123")).toBe(123);
  });

  it("should convert number to TMDBMovieID", () => {
    expect(convertToTDBMovieID(456)).toBe(456);
  });

  it("should throw error for invalid numeric string", () => {
    expect(() => convertToTDBMovieID("abc")).toThrow("Invalid IMDB ID");
  });

  it("should throw error for non-numeric string", () => {
    expect(() => convertToTDBMovieID("123abc")).toThrow("Invalid IMDB ID");
  });
});

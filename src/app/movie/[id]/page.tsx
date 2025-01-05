import { getMovieDetails } from "@/lib/core";
import { Suspense } from "react";

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  return (
    <div>
      <h1>Movie Details</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <MovieDetails params={params} />
      </Suspense>
    </div>
  );
}

async function MovieDetails({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow-md">
      <div className="mb-4">
        <h2 className="text-xl font-bold">{movie.language_title || movie.original_title}</h2>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <img
          className="w-full md:w-1/3 rounded"
          src={movie.poster_url?.toString() || ""}
          alt={movie.original_title}
        />
        <div className="flex-1">
          <p className="mb-2 font-semibold">Release Year: {movie.release_year}</p>
          <p className="mb-2 font-semibold">Runtime: {movie.runtime_minutes} min</p>
          <p className="mb-2 italic">{movie.overview}</p>
          <p className="mb-2">IMDB ID: {movie.imdb_id}</p>
          <p className="mb-2">Spoken Languages:</p>
          <ul className="list-disc list-inside">
            {movie.spoken_languages?.map((lang, idx) => (
              <li key={idx}>{lang.name}</li>
            ))}
          </ul>
          {/* Suggestions: Display more info like rating, cast, or similar movies */}
        </div>
      </div>
    </div>
  );
}

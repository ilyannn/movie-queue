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
    <p>
      Movie ID: {id}
      <br /> Title: {movie.original_title} <br /> Release Year:{" "}
      {movie.release_date.slice(0, 4)}
    </p>
  );
}

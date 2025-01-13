import type { Metadata, ResolvingMetadata } from "next";
import {
  getMovieDetails,
  addToMovieQueue,
  getCurrentUserQueues,
} from "@/lib/core";
import React, { Suspense } from "react";
import MovieDetails, { type Props } from "./MovieDetails";

export default async function MovieDetailsPage({ params }: Props) {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <MovieDetails params={params} />
      </Suspense>
    </div>
  );
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const newImages = [movie.poster_small_url].filter((u) => u !== null) as [
    string
  ];

  return {
    title: `${movie.original_title} (${movie.release_year}) | Movie Queue`,
    openGraph: {
      images: [...newImages, ...previousImages],
    },
  };
}

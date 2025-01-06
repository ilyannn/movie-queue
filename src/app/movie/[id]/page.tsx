import type { Metadata, ResolvingMetadata } from "next";
import { getMovieDetails, addToMovieQueue } from "@/lib/core";
import Link from "next/link";
import React, { Suspense, useCallback } from "react";
import { Tag } from "@/components/ui/tag";
import { HStack } from "@chakra-ui/react";
import Image from "next/image";
import { QueueID } from "@/lib/core/types";
import { AddToQueueButton } from "@/components/AddToQueueButton";

type Props = {
  params: Promise<{ id: number }>;
};

const HARDCODED_MY_QUEUE_ID = 1 as QueueID;
const HARDCODED_GROUP_QUEUE_ID = 2 as QueueID;

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
    title: `${movie.language_title} (${movie.release_year}) | Movie Queue`,
    openGraph: {
      images: [...newImages, ...previousImages],
    },
  };
}

const MovieDetails: React.FC<Props> = async ({ params }: Props) => {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  const fullTitle = `${movie.language_title} (${movie.release_year})`;

  return (
    <>
      {movie.backdrop_url && (
        <div className="w-full h-48 md:h-64 relative overflow-hidden">
          <img
            src={movie.backdrop_url}
            alt={`${fullTitle} backdrop`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
        </div>
      )}
      <div className="p-4 max-w-3xl mx-auto bg-white rounded shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-bold">{fullTitle}</h2>
          <h3 className="text-md font-semibold text-gray-500">
            <HStack gap={2}>
              {movie.original_title === movie.language_title
                ? null
                : movie.original_title}
              {movie.spoken_languages?.map((lang) => (
                <Tag key={lang.name}>{lang.name}</Tag>
              ))}
            </HStack>
          </h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <img
            className="w-full md:w-1/3 rounded"
            src={movie.poster_url || ""}
            alt={fullTitle}
          />
          <div className="flex-1">
            <p className="mb-2 font-semibold">
              Runtime: {movie.runtime_minutes} min
            </p>
            <p className="mb-2 italic">{movie.overview}</p>
            <HStack gap={4} h={8} align={"center"} justify={"flex-start"}>
              {movie.imdb_url && (
                <Link href={movie.imdb_url}>
                  <Image
                    src="/icons/imdb.png"
                    alt="IMDB logo"
                    className="object-contain"
                    height={40}
                    width={60}
                    priority
                  />
                </Link>
              )}
              <AddToQueueButton
                queueId={HARDCODED_MY_QUEUE_ID}
                queueName="My Queue"
                movieId={movie.id}
                isAdded={false}
              />
              <AddToQueueButton
                queueId={HARDCODED_GROUP_QUEUE_ID}
                queueName="Group Queue"
                movieId={movie.id}
                isAdded={false}
              />
            </HStack>
            {/* Suggestions: Display more info like rating, cast, or similar movies */}
          </div>
        </div>
      </div>
    </>
  );
};

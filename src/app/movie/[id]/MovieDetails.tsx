"use server";

import { AddToQueueButton } from "@/components/AddToQueueButton";
import { getCurrentUserQueues, getMovieDetails } from "@/lib/core";
import { getUser } from "@/lib/services/backend";
import { createServerSupabaseClient } from "@/lib/services/supabase/server";
import { HStack, Link } from "@chakra-ui/react";
import { Tag } from "@/components/ui";
import Image from "next/image";
import { UUID } from "crypto";

import "@/app/tailwind.css";

export interface Props {
  params: Promise<{
    id: number;
  }>;
}

const MovieDetailsCard: React.FC<Props> = async ({ params }) => {
  const { id } = await params;

  if (id === "installHook.js.map") {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const authUser = await supabase.auth.getSession();
  console.log("authUser", authUser);
  const authUserUUID = authUser?.data.session?.user?.id as UUID;

  if (!authUserUUID) {
    return <p>User not known yet...</p>;
  }

  const user = await getUser(authUserUUID);

  const movie = await getMovieDetails(id, user?.languages);
  const queues = await getCurrentUserQueues();

  const fullTitle = movie
    ? `${movie.language_title} (${movie.release_year})`
    : "";

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
              {queues &&
                queues.map((queue) => (
                  <AddToQueueButton
                    key={queue.queue_id}
                    isPersonal={queue.personal}
                    queueId={queue.queue_id}
                    queueName={queue.name}
                    movieId={movie.id}
                    isAdded={false} //queue.items.some((item) => item.id === movie.id)}
                  />
                ))}
            </HStack>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetailsCard;

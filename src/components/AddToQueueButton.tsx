"use client";

import { addToMovieQueue } from "@/lib/core";
import { MovieID, QueueID } from "@/lib/core/types";
import { Button } from "@chakra-ui/react";
import React, { useCallback } from "react";

interface AddToQueueButtonProps {
  queueId: QueueID;
  queueName: string;
  movieId: MovieID;
  isAdded: boolean;
}

// Move interactive parts to a client component
export const AddToQueueButton: React.FC<AddToQueueButtonProps> = ({
  queueId,
  queueName,
  movieId,
  isAdded,
}) => {
  const handleAddToQueue = useCallback(() => {
    //    addToMovieQueue(movieId, queueId);
  }, [movieId, queueId]);

  return <Button onClick={() => handleAddToQueue()}>Add to {queueName}</Button>;
};

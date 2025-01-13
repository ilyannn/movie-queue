"use client";

import { addToMovieQueue } from "@/lib/core";
import { MovieID, QueueID } from "@/lib/core/types";
import { Button } from "@chakra-ui/react";
import React, { useCallback } from "react";

interface AddToQueueButtonProps {
  isPersonal: boolean;
  queueId: QueueID;
  queueName: string;
  movieId: MovieID;
  isAdded: boolean;
}

export const AddToQueueButton: React.FC<AddToQueueButtonProps> = ({
  isPersonal,
  queueId,
  queueName,
  movieId,
  isAdded,
}) => {
  const handleAddToQueue = useCallback(() => {
    //    addToMovieQueue(movieId, queueId);
  }, [movieId, queueId]);

  const name = isPersonal ? "My Queue" : queueName;
  return <Button onClick={() => handleAddToQueue()}>Add to {name}</Button>;
};

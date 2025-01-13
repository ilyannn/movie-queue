"use server";

import type { UUID } from "crypto";
import type { Locale } from "@services/i18n";
import { QueueID, UserID } from "../../core/types";
import { TMDBCountryCode, TMDBLanguageCode } from "../tmdb";

// Types for the API
export interface UserSchema {
  user_id: UserID;
  auth_user_uuid: UUID;
  queue_id: QueueID;
  user_name: string;
  user_locale: Locale;
  languages: string;
  region: TMDBCountryCode;
}

export interface UserCreateData {
  user_name: string;
  user_locale: Locale;
  languages: string;
  region: TMDBCountryCode;
}

export type UserUpdateData = Partial<UserCreateData>;

export interface QueueInfo {
  personal: boolean;
  queue_id: QueueID;
  name: string;
  languages: string;
  region: TMDBCountryCode;
}

class BackendAPIError extends Error {
  status: number;

  constructor(response: Response) {
    super(`HTTP error! status: ${response.status}`);
    this.status = response.status;
  }
}

class BackendService {
  private baseUrl: string;

  constructor() {
    const url = process.env.BACKEND_API_URL;
    if (!url) {
      console.error("BACKEND_API_URL is not set");
    }
    this.baseUrl = url || "";
  }

  async fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log("fetchJson", this.baseUrl, endpoint, options);
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new BackendAPIError(response);
    }

    return response.json() as Promise<T>;
  }
}

const backend = new BackendService();

// User endpoints
export const getUser = async (
  authUserUuid: UUID
): Promise<UserSchema | null> => {
  try {
    return await backend.fetchJson<UserSchema>(`/users/${authUserUuid}`);
  } catch (error) {
    if (error instanceof BackendAPIError && error.status == 404) {
      return null;
    }
    throw error;
  }
};

export const createOrUpdateUser = async (
  authUserUuid: UUID,
  userData: UserUpdateData
): Promise<UserSchema> => {
  return backend.fetchJson<UserSchema>(`/users/${authUserUuid}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (
  authUserUuid: UUID
): Promise<{ message: string }> => {
  return backend.fetchJson<{ message: string }>(`/users/${authUserUuid}`, {
    method: "DELETE",
  });
};

// Queue endpoints
export const getUserQueues = async (
  authUserUuid: UUID
): Promise<QueueInfo[]> => {
  return backend.fetchJson<QueueInfo[]>(`/queues/by_user/${authUserUuid}`);
};

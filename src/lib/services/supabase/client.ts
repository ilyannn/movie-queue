"use client";

import { createClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";
import { UUID } from "crypto";
import { useEffect, useState } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_id!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UseAuthResponse {
  authUser: User | null;
  authUserUUID: UUID | null;
  authLoading: boolean;
}

export const useAuth = (): UseAuthResponse => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    authUser: user,
    authUserUUID: user?.id as UUID,
    authLoading: loading,
  };
};

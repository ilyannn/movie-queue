"use server";
import { createServerSupabaseClient } from "@/lib/services/supabase/server";
import { redirect } from "next/navigation";

export const githubLogin = async () => {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
  });

  if (error) {
    console.error("Error logging in with GitHub", error);
    throw error;
  }

  redirect("/profile");
};

export const passwordLogin = async (email: string, password: string) => {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error logging in with email and password", error);
    throw error;
  }

  redirect("/profile");
};

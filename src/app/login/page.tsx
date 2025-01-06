"use client";

import { supabase } from "@/lib/services/supabase/client";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function Page() {
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    const { email, password } = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };
    console.log(e, email, password);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) {
      console.error(error);
      return;
    }
    router.push("/about");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
}
// ...existing code...

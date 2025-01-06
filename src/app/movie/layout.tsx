import { redirect } from "next/navigation";
import { createClient } from "@/lib/services/supabase/server";

export default async function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const supabase = await createClient();
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();

  const session = true;

  if (!session) {
    redirect("/login");
  }

  return <section>{children}</section>;
}

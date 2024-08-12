import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_URL!,
  import.meta.env.VITE_NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
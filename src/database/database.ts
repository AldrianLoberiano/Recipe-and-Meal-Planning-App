import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export interface DatabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

function getDatabaseConfig(): DatabaseConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
    );
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  };
}

let databaseClient: SupabaseClient | null = null;

export function getDatabaseClient(): SupabaseClient {
  if (databaseClient) {
    return databaseClient;
  }

  const { supabaseUrl, supabaseAnonKey } = getDatabaseConfig();
  databaseClient = createClient(supabaseUrl, supabaseAnonKey);

  return databaseClient;
}

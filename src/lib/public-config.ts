import { useEffect, useState } from "react";

export type PublicConfig = {
  payments: boolean;
  newsletter: boolean;
  contact: boolean;
  purchasable: { slug: string; price_grosze: number }[];
  supabase: { url: string; anonKey: string } | null;
};

let cache: Promise<PublicConfig> | null = null;

export function loadPublicConfig(): Promise<PublicConfig> {
  if (!cache) {
    cache = fetch("/api/public-config")
      .then((r) => (r.ok ? (r.json() as Promise<PublicConfig>) : Promise.reject(new Error(String(r.status)))))
      .catch(() => {
        cache = null;
        return { payments: false, newsletter: false, contact: false, purchasable: [], supabase: null };
      });
  }
  return cache;
}

/** Runtime config from the server (client-side only; null while loading). */
export function usePublicConfig() {
  const [cfg, setCfg] = useState<PublicConfig | null>(null);
  useEffect(() => {
    let alive = true;
    void loadPublicConfig().then((c) => alive && setCfg(c));
    return () => {
      alive = false;
    };
  }, []);
  return cfg;
}

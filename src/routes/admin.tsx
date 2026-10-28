import { createFileRoute } from "@tanstack/react-router";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Loader2, LogOut, Upload } from "lucide-react";
import { loadPublicConfig } from "@/lib/public-config";
import { pageHead } from "@/lib/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => pageHead("Panel", "Panel administracyjny sklepu.", "/admin", { noindex: true }),
  component: AdminPage,
});

type AdminProduct = { id: string; slug: string; title: string; description: string; price_grosze: number; status: "draft" | "published"; pdf_path: string | null; cover_path: string | null; includes: string[] | null };
type AdminOrder = { id: string; created_at: string; paid_at: string | null; product_title: string; amount_grosze: number; status: string; email: string | null; download_count: number };
type Report = { totalGrosze: number; paidCount: number; byMonth: { month: string; count: number; grosze: number }[]; byProduct: { title: string; count: number; grosze: number }[] };

const zl = (g: number) => `${(g / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2 })} zł`;
const STATUS_PL: Record<string, string> = { pending: "oczekuje", paid: "opłacone", failed: "nieudane", expired: "wygasło", refunded: "zwrócone" };

function AdminPage() {
  const [sb, setSb] = useState<SupabaseClient | null | "none">(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    void loadPublicConfig().then((cfg) => {
      if (!cfg.supabase) return setSb("none");
      const client = createClient(cfg.supabase.url, cfg.supabase.anonKey);
      setSb(client);
      void client.auth.getSession().then(({ data }) => setSession(data.session));
      client.auth.onAuthStateChange((_e, s) => setSession(s));
    });
  }, []);

  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-28 pt-36 md:px-10">
      <p className="latin text-xl text-brown">Officina</p>
      <h1 className="text-h2 mt-2">Panel sklepu</h1>
      <div className="mt-10">
        {sb === null && <Loader2 className="h-6 w-6 animate-spin" aria-label="Wczytywanie" />}
        {sb === "none" && (
          <div className="measure border-l-4 border-copper bg-paper px-6 py-5">
            <p className="font-semibold">Panel nie jest jeszcze skonfigurowany.</p>
            <p className="mt-2 text-muted-foreground">Ustaw zmienne SUPABASE_URL, SUPABASE_ANON_KEY i SUPABASE_SERVICE_ROLE_KEY oraz uruchom migrację bazy — instrukcja w README.</p>
          </div>
        )}
        {sb && sb !== "none" && !session && <Login sb={sb} />}
        {sb && sb !== "none" && session && <Dashboard sb={sb} session={session} />}
      </div>
    </section>
  );
}

function Login({ sb }: { sb: SupabaseClient }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await sb.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setErr("Nieprawidłowy e-mail lub hasło.");
  }
  return (
    <form onSubmit={submit} className="max-w-sm space-y-5">
      <div>
        <label htmlFor="a-email" className="font-semibold">E-mail</label>
        <input id="a-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 min-h-12 w-full rounded-sm border border-input bg-white px-4" />
      </div>
      <div>
        <label htmlFor="a-pass" className="font-semibold">Hasło</label>
        <input id="a-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 min-h-12 w-full rounded-sm border border-input bg-white px-4" />
      </div>
      <button type="submit" disabled={busy} className="inline-flex min-h-12 items-center gap-2 rounded-sm bg-forest px-6 font-semibold text-ivory disabled:opacity-70">
        {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />} Zaloguj się
      </button>
      <p role="alert" className="text-[#9b3b2a]">{err}</p>
    </form>
  );
}

function Dashboard({ sb, session }: { sb: SupabaseClient; session: Session }) {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<AdminProduct[] | null>(null);
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const headers = { authorization: `Bearer ${session.access_token}`, "content-type": "application/json" };

  const load = useCallback(async () => {
    setError("");
    const [p, o] = await Promise.all([fetch("/api/admin/products", { headers }), fetch("/api/admin/orders", { headers })]);
    const pb = await p.json().catch(() => ({}));
    const ob = await o.json().catch(() => ({}));
    if (!p.ok) return setError(pb.message ?? "Brak dostępu.");
    setProducts(pb.products);
    if (o.ok) { setOrders(ob.orders); setReport(ob.report); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.access_token]);

  useEffect(() => { void load(); }, [load]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div role="tablist" className="flex gap-2">
          {(["products", "orders"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn("min-h-11 rounded-sm px-4 font-semibold", tab === t ? "bg-forest text-ivory" : "text-forest hover:bg-sage")}>
              {t === "products" ? "Produkty" : "Zamówienia i sprzedaż"}
            </button>
          ))}
        </div>
        <button onClick={() => void sb.auth.signOut()} className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-deep">
          <LogOut className="h-4 w-4" aria-hidden /> Wyloguj ({session.user.email})
        </button>
      </div>
      {error && <p role="alert" className="mt-6 border-l-4 border-[#9b3b2a] bg-paper px-5 py-4">{error}</p>}
      {tab === "products" && products && (
        <ul className="mt-8 space-y-6">
          {products.map((p) => <ProductEditor key={p.id} product={p} sb={sb} headers={headers} onSaved={load} />)}
        </ul>
      )}
      {tab === "orders" && (
        <div className="mt-8 space-y-12">
          {report && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="border border-border p-5"><p className="text-muted-foreground">Przychód (opłacone)</p><p className="mt-1 font-display text-3xl">{zl(report.totalGrosze)}</p></div>
              <div className="border border-border p-5"><p className="text-muted-foreground">Opłacone zamówienia</p><p className="mt-1 font-display text-3xl">{report.paidCount}</p></div>
              <div className="border border-border p-5">
                <p className="text-muted-foreground">Według miesięcy</p>
                <ul className="mt-2 text-[0.9375rem]">{report.byMonth.slice(0, 6).map((m) => <li key={m.month} className="flex justify-between"><span>{m.month}</span><span>{m.count} szt. · {zl(m.grosze)}</span></li>)}</ul>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-[0.9375rem]">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="py-2">Data</th><th>Produkt</th><th>Kwota</th><th>Status</th><th>E-mail</th><th>Pobrania</th></tr></thead>
              <tbody>
                {(orders ?? []).map((o) => (
                  <tr key={o.id} className="border-b border-border/60">
                    <td className="py-2">{new Date(o.created_at).toLocaleString("pl-PL")}</td>
                    <td>{o.product_title}</td>
                    <td>{zl(o.amount_grosze)}</td>
                    <td><span className={cn("rounded-sm px-2 py-0.5", o.status === "paid" ? "bg-forest text-ivory" : "bg-paper")}>{STATUS_PL[o.status] ?? o.status}</span></td>
                    <td>{o.email ?? "—"}</td>
                    <td>{o.download_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders?.length === 0 && <p className="mt-6 text-muted-foreground">Nie ma jeszcze zamówień.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductEditor({ product, sb, headers, onSaved }: { product: AdminProduct; sb: SupabaseClient; headers: Record<string, string>; onSaved: () => void }) {
  const [title, setTitle] = useState(product.title);
  const [price, setPrice] = useState(String(product.price_grosze / 100));
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function patch(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/products", { method: "PATCH", headers, body: JSON.stringify({ id: product.id, ...body }) });
    const b = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(b.message ?? "Nie udało się zapisać.");
  }
  async function save() {
    setBusy("save"); setMsg("");
    try {
      const grosze = Math.round(Number(price.replace(",", ".")) * 100);
      if (!Number.isFinite(grosze) || grosze < 100) throw new Error("Podaj poprawną cenę (min. 1 zł).");
      await patch({ title: title.trim(), price_grosze: grosze });
      setMsg("Zapisano."); onSaved();
    } catch (e) { setMsg((e as Error).message); } finally { setBusy(null); }
  }
  async function toggle() {
    setBusy("status"); setMsg("");
    try { await patch({ status: product.status === "published" ? "draft" : "published" }); onSaved(); }
    catch (e) { setMsg((e as Error).message); } finally { setBusy(null); }
  }
  async function upload(kind: "pdf" | "cover", file: File) {
    setBusy(kind); setMsg("");
    try {
      const res = await fetch("/api/admin/upload-url", { method: "POST", headers, body: JSON.stringify({ productId: product.id, kind, fileName: file.name }) });
      const b = await res.json();
      if (!res.ok) throw new Error(b.message ?? "Nie udało się przygotować wysyłki.");
      const { error } = await sb.storage.from(b.bucket).uploadToSignedUrl(b.path, b.token, file, file.type ? { contentType: file.type } : {});
      if (error) throw new Error("Wysyłka pliku nie powiodła się.");
      await patch(kind === "pdf" ? { pdf_path: b.path } : { cover_path: b.path });
      setMsg(kind === "pdf" ? "Plik PDF dodany." : "Okładka dodana."); onSaved();
    } catch (e) { setMsg((e as Error).message); } finally { setBusy(null); }
  }

  return (
    <li className="border border-border bg-white/60 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.875rem] text-muted-foreground">{product.slug}</p>
          <span className={cn("mt-1 inline-block rounded-sm px-2 py-0.5 text-[0.875rem] font-semibold", product.status === "published" ? "bg-forest text-ivory" : "bg-paper text-brown")}>
            {product.status === "published" ? "Opublikowany" : "Szkic"}
          </span>
        </div>
        <button onClick={toggle} disabled={!!busy} className="min-h-11 rounded-sm border border-forest px-4 font-semibold text-forest hover:bg-forest hover:text-ivory disabled:opacity-60">
          {product.status === "published" ? "Cofnij do szkicu" : "Opublikuj"}
        </button>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_160px_auto]">
        <label className="block"><span className="text-[0.875rem] font-semibold">Tytuł</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 min-h-11 w-full rounded-sm border border-input bg-white px-3" /></label>
        <label className="block"><span className="text-[0.875rem] font-semibold">Cena (zł)</span>
          <input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 min-h-11 w-full rounded-sm border border-input bg-white px-3" /></label>
        <button onClick={save} disabled={!!busy} className="mt-6 min-h-11 rounded-sm bg-forest px-5 font-semibold text-ivory disabled:opacity-60">{busy === "save" ? "Zapisywanie…" : "Zapisz"}</button>
      </div>
      {!product.includes && (
        <div className="mt-5 flex flex-wrap gap-6 text-[0.9375rem]">
          <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-forest">
            <Upload className="h-4 w-4" aria-hidden /> {product.pdf_path ? "Podmień PDF" : "Dodaj PDF"}
            <input type="file" accept="application/pdf" className="sr-only" disabled={!!busy} onChange={(e) => e.target.files?.[0] && upload("pdf", e.target.files[0])} />
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 font-semibold text-forest">
            <Upload className="h-4 w-4" aria-hidden /> {product.cover_path ? "Podmień okładkę" : "Dodaj okładkę"}
            <input type="file" accept="image/webp,image/jpeg,image/png" className="sr-only" disabled={!!busy} onChange={(e) => e.target.files?.[0] && upload("cover", e.target.files[0])} />
          </label>
          <span className="text-muted-foreground">{product.pdf_path ? "PDF: dodany (prywatny)" : "PDF: brak — publikacja zablokowana"}</span>
        </div>
      )}
      {product.includes && <p className="mt-4 text-[0.9375rem] text-muted-foreground">Pakiet: {product.includes.join(", ")}. Publikacja wymaga PDF-ów wszystkich e-booków z pakietu.</p>}
      <p role="status" className="mt-3 min-h-6 text-[0.9375rem]">{busy && busy !== "save" ? "Trwa wysyłanie…" : msg}</p>
    </li>
  );
}

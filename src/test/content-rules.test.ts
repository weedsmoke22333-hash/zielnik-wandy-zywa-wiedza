import { describe, expect, it } from "vitest";
import { herbs } from "@/data/herbs";
import { articles } from "@/data/articles";
import { lookalikes } from "@/data/lookalikes";
import { interactions } from "@/data/interactions";
import { getProduct, products } from "@/data/products";

/**
 * Content compliance rules. These encode the editorial/legal policy in code:
 * nothing about herbs gets published without evidence level, precautions and real sources,
 * and no copy may claim that herbs cure, treat or prevent disease.
 */
const FORBIDDEN = [/\bleczy\b/i, /\bwyleczy/i, /\bzapobiega\b/i, /\bwzmacnia odporno/i, /\bcudown/i, /\bgwarantuj/i];
const isUrl = (u: string) => /^https:\/\/[^\s]+$/.test(u);

function textOf(o: unknown): string {
  return JSON.stringify(o);
}

describe("herb atlas", () => {
  it.each(herbs.map((h) => [h.slug, h] as const))("%s has evidence, precautions, interactions and sources", (_s, h) => {
    expect(h.evidence).toBeTruthy();
    expect(h.contraindications.length).toBeGreaterThan(0);
    expect(h.interactions.length).toBeGreaterThan(20);
    expect(h.sources.length).toBeGreaterThan(0);
    h.sources.forEach((s) => expect(isUrl(s.url)).toBe(true));
    expect(h.harvest.length).toBeGreaterThan(0);
  });

  it("uses no cure/prevention claims", () => {
    herbs.forEach((h) => FORBIDDEN.forEach((re) => expect(textOf(h), `${h.slug} ${re}`).not.toMatch(re)));
  });

  it("links only to existing look-alike entries", () => {
    herbs.filter((h) => h.lookalike).forEach((h) => expect(lookalikes.some((l) => l.slug === h.lookalike), h.slug).toBe(true));
  });

  it("has unique slugs", () => {
    expect(new Set(herbs.map((h) => h.slug)).size).toBe(herbs.length);
  });
});

describe("blog articles", () => {
  it.each(articles.map((a) => [a.slug, a] as const))("%s has precautions and sources", (_s, a) => {
    expect(a.precautions.length).toBeGreaterThan(0);
    expect(a.sources.length).toBeGreaterThan(0);
    a.sources.forEach((s) => expect(isUrl(s.url)).toBe(true));
    a.relatedHerbs.forEach((slug) => expect(herbs.some((h) => h.slug === slug), slug).toBe(true));
    if (a.relatedProduct) expect(getProduct(a.relatedProduct), a.relatedProduct).toBeTruthy();
  });

  it("uses no cure/prevention claims", () => {
    articles.forEach((a) => FORBIDDEN.forEach((re) => expect(textOf(a.sections), `${a.slug} ${re}`).not.toMatch(re)));
  });
});

describe("interactions lookup", () => {
  it("every entry has an effect, advice and a source", () => {
    interactions.forEach((i) => {
      expect(i.effect.length).toBeGreaterThan(20);
      expect(i.advice.length).toBeGreaterThan(10);
      expect(i.sources.length).toBeGreaterThan(0);
      if (i.herbSlug) expect(herbs.some((h) => h.slug === i.herbSlug), i.herbSlug).toBe(true);
    });
  });
});

describe("products", () => {
  it("all sample products stay drafts until the owner approves them", () => {
    products.forEach((p) => expect(p.status).toBe("draft"));
  });
  it("bundle is cheaper than buying separately and references real products", () => {
    const b = products.find((p) => p.category === "pakiet")!;
    const total = b.includes!.reduce((s, slug) => s + getProduct(slug)!.priceZl, 0);
    expect(b.priceZl).toBeLessThan(total);
  });
  it("uses no cure/prevention claims", () => {
    products.forEach((p) => FORBIDDEN.forEach((re) => expect(textOf(p), `${p.slug} ${re}`).not.toMatch(re)));
  });
});

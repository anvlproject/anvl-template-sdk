/**
 * anvl-template-sdk — schema.ts
 * Defines the exact interface a template must implement.
 * Validated via Zod at build time and before submission.
 */
import { z } from "zod";

export const TemplateManifestSchema = z.object({
  /** Unique kebab-case ID, e.g. "retro-wave" */
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "id must be kebab-case"),
  /** Display name shown in ANVL template picker */
  name: z.string().min(3).max(40),
  /** One-line description */
  description: z.string().min(10).max(120),
  /** Author name or handle */
  author: z.string().min(1).max(60),
  /** Version in semver format */
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  /** Preview screenshot path relative to template root (PNG, 1200x630) */
  preview: z.string().endsWith(".png"),
  /** Default primary color hex */
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  /** Default background color hex */
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  /** Tags for discoverability */
  tags: z.array(z.string()).min(1).max(8),
});

export type TemplateManifest = z.infer<typeof TemplateManifestSchema>;

/**
 * Required CSS custom properties that ANVL injects at render time.
 * Your template MUST use these variables — hardcoding colors breaks user customization.
 *
 * --anvl-primary    User's chosen primary color
 * --anvl-bg         User's chosen background color
 * --anvl-text       Auto-derived readable text color
 * --anvl-muted      Muted text color
 * --anvl-border     Border / divider color
 */
export const REQUIRED_CSS_VARS = [
  "--anvl-primary",
  "--anvl-bg",
  "--anvl-text",
  "--anvl-muted",
  "--anvl-border",
] as const;

/**
 * Data fields injected into template at render time.
 * Your template receives a `window.ANVL_DATA` object with these fields.
 */
export interface AnvlTemplateData {
  name: string;
  ticker: string;
  tagline: string;
  chain: string;
  contractAddress: string;
  logoUrl: string;

  totalSupply: string;
  buyTax: number;
  sellTax: number;
  burnPercent: number;
  lpLock: number;
  distribution: Array<{ label: string; percent: number; color: string }>;

  roadmap: Array<{
    id: string;
    phase: string;
    title: string;
    description: string;
    date: string;
    done: boolean;
  }>;

  socials: {
    telegram: string;
    twitter: string;
    discord: string;
    dexscreener: string;
    buyLink: string;
    coingecko: string;
    audit: string;
  };

  heroTitle: string;
  lore: string;
  about: string;
  howToBuy: string;
  disclaimer: string;
}

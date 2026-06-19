/**
 * anvl-template-sdk — preview-server.ts
 * Spins up a local Express server to preview a template with live mock data.
 */
import express from "express";
import path from "path";
import fs from "fs";
import { AnvlTemplateData } from "./schema";

const MOCK_DATA: AnvlTemplateData = {
  name: "RetroWave Coin",
  ticker: "RETRO",
  tagline: "Ride the neon wave to the moon 🌊",
  chain: "solana",
  contractAddress: "RetroXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  logoUrl: "https://placehold.co/200x200/ff6b35/ffffff?text=RETRO",

  totalSupply: "1,000,000,000",
  buyTax: 2,
  sellTax: 2,
  burnPercent: 5,
  lpLock: 100,
  distribution: [
    { label: "Liquidity Pool", percent: 70, color: "#4ade80" },
    { label: "Marketing",      percent: 15, color: "#f59e0b" },
    { label: "Team",           percent: 10, color: "#60a5fa" },
    { label: "Burn",           percent: 5,  color: "#f87171" },
  ],

  roadmap: [
    { id: "1", phase: "Phase 1", title: "Launch",    description: "Token launch on Raydium", date: "Q1 2025", done: true  },
    { id: "2", phase: "Phase 2", title: "Community", description: "10K holders milestone",   date: "Q2 2025", done: false },
    { id: "3", phase: "Phase 3", title: "CEX",       description: "Tier-1 CEX listing",      date: "Q3 2025", done: false },
  ],

  socials: {
    telegram:     "https://t.me/example",
    twitter:      "https://twitter.com/example",
    discord:      "https://discord.gg/example",
    dexscreener:  "https://dexscreener.com",
    buyLink:      "https://jup.ag/swap/SOL-RETRO",
    coingecko:    "",
    audit:        "",
  },

  heroTitle:  "The Future is Neon",
  lore:       "Born in the digital underground, RetroWave Coin harnesses the aesthetic power of synthwave culture and channels it into the Solana blockchain.",
  about:      "RetroWave is a community-driven memecoin with zero team tokens and fully locked liquidity. We are here to vibe and win.",
  howToBuy:   "1. Get a Solana wallet. 2. Buy SOL. 3. Swap on Jupiter. 4. HODL.",
  disclaimer: "This is a memecoin. Not financial advice. Do your own research.",
};

export function startPreviewServer(templateDir: string, port = 4000): void {
  const app = express();

  // Serve static template files
  app.use(express.static(templateDir));

  // Inject ANVL_DATA into HTML
  app.get("/", (_req, res) => {
    const indexPath = path.join(templateDir, "index.html");
    if (!fs.existsSync(indexPath)) {
      res.status(404).send("index.html not found in template directory");
      return;
    }

    let html = fs.readFileSync(indexPath, "utf8");
    const injection = `<script>window.ANVL_DATA = ${JSON.stringify(MOCK_DATA, null, 2)};</script>`;

    // Inject before </head> or at the start of <body>
    if (html.includes("</head>")) {
      html = html.replace("</head>", injection + "\n</head>");
    } else {
      html = injection + html;
    }

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });

  // Mock data endpoint
  app.get("/api/mock-data", (_req, res) => {
    res.json(MOCK_DATA);
  });

  app.listen(port, () => {
    console.log(`\n  [anvl-template-sdk] Preview server running`);
    console.log(`  http://localhost:${port}\n`);
    console.log(`  Template dir: ${templateDir}`);
    console.log(`  Press Ctrl+C to stop\n`);
  });
}

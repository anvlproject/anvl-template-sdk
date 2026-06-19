# anvl-template-sdk

Build, preview, and validate custom coin site templates for the [ANVL](https://anvl.site) ecosystem.

## Quick Start

```bash
# Scaffold a new template
npx anvl-template init my-neon-theme

# Preview it locally with mock data
cd my-neon-theme
npx anvl-template preview .

# Validate before submitting
npx anvl-template validate .
```

## Template Structure

Every ANVL template is a directory with these required files:

```
my-template/
├── manifest.json     Template metadata (id, name, author, tags…)
├── index.html        Main HTML — receives window.ANVL_DATA at runtime
├── style.css         Styles — must use ANVL CSS variables
├── template.js       Renders ANVL_DATA into the DOM
└── preview.png       Screenshot 1200×630px shown in template picker
```

## CSS Variables

ANVL injects user color choices into these variables at render time.  
**Your template must use them** — hardcoded colors break user customization.

| Variable | Purpose |
|---|---|
| `--anvl-primary` | Primary / accent color |
| `--anvl-bg` | Background color |
| `--anvl-text` | Main text color |
| `--anvl-muted` | Secondary / muted text |
| `--anvl-border` | Border and divider color |

## ANVL_DATA Reference

Your `template.js` receives `window.ANVL_DATA` with these fields:

```ts
{
  name, ticker, tagline, chain, contractAddress, logoUrl,
  totalSupply, buyTax, sellTax, burnPercent, lpLock,
  distribution: [{ label, percent, color }],
  roadmap: [{ phase, title, description, date, done }],
  socials: { telegram, twitter, discord, dexscreener, buyLink, coingecko, audit },
  heroTitle, lore, about, howToBuy, disclaimer
}
```

## Example Template

See `templates/example-retro-wave/` for a complete working template with:
- Animated synthwave grid hero
- Tokenomics grid
- Roadmap timeline
- Social links footer

## Submitting Your Template

1. Run `npx anvl-template validate .` — must pass with zero errors
2. Create a pull request to the [ANVL Templates Registry](https://github.com/anvlproject/anvl-template-sdk)
3. Include a clear `preview.png` (1200×630)

## License

MIT

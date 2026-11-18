# Homepage static demo

Self-contained English homepage. Copy **everything in this folder** to your demos repo (including hidden files).

```bash
# From the main webpage repo root:
pnpm run build:github-pages-demo
```

## Deploy checklist

Upload/deploy the **full folder**, not only `index.html`:

- `index.html`
- `.nojekyll` (required — or GitHub/Jekyll ignores `_astro/` and CSS never loads)
- `_astro/`
- `images/`
- favicons at the root

## View locally

```bash
npx serve .
# http://localhost:3000/
```

From the main repo: `pnpm run preview:homepage-demo`
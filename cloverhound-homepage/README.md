# Homepage static demo

Self-contained build of the English homepage. Copy this entire folder into a demo repo.

Regenerate from the main site project:

```bash
pnpm run build:github-pages-demo
```

## View it

Use any static server at **this folder’s root** (opening `index.html` directly in the browser will not load JS modules):

```bash
npx serve .
# http://localhost:3000/
```

Or from the main repo: `pnpm run preview:homepage-demo`

Includes `index.html`, `_astro/`, `images/`, and favicons only. In-site nav links point at routes that are not shipped in this demo.
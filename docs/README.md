# Documentation

This directory contains the documentation site for the react-use-anywhere library, built with [VitePress](https://vitepress.dev/).

## Development

To run the documentation site locally:

```bash
cd docs
npm install
npm run dev
```

The site will be available at `http://localhost:5173/react-use-anywhere/`

## Building

To build the documentation:

```bash
cd docs
npm run build
```

The built site will be in the `docs/.vitepress/dist` directory.

## Deployment

The documentation is automatically deployed to GitHub Pages when changes are pushed to the main branch via GitHub Actions. You can also deploy manually:

```bash
npm run docs:deploy
```

## Structure

- `.vitepress/config.ts` - VitePress configuration
- `index.md` - Homepage
- `guide/` - User guides and tutorials
- `api/` - API reference documentation
- `examples/` - Example usage patterns
- `demo/` - Information about the demo application
- `public/` - Static assets (logo, favicon, etc.)

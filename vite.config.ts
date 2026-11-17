import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * three-globe statically imports `three/webgpu` + `three/tsl` (only used by its GPU heatmap layer)
 * and `h3-js` (only used by its hex-bin layers). Orbis uses neither layer, yet those imports alone
 * pull ~1 MB of minified code into the bundle. Swap them for stubs that throw if ever called, but
 * only when three-globe is the importer, so our own code can still use the real modules.
 */
function stubUnusedGlobeLayers(): Plugin {
  const STUBS: Record<string, string> = {
    'three/webgpu': `
      const off = (n) => class { constructor() { throw new Error('three/webgpu is stubbed out in Orbis (' + n + ')'); } };
      export const WebGPURenderer = off('WebGPURenderer');
      export const StorageInstancedBufferAttribute = off('StorageInstancedBufferAttribute');`,
    'three/tsl': `export {};`,
    'h3-js': `
      const off = () => { throw new Error('h3-js is stubbed out in Orbis'); };
      export const latLngToCell = off, cellToLatLng = off, cellToBoundary = off, polygonToCells = off;`,
  }
  const PREFIX = '\0orbis-stub:'
  return {
    name: 'orbis:stub-unused-globe-layers',
    enforce: 'pre',
    resolveId(source, importer) {
      if (source in STUBS && importer && /[\\/]node_modules[\\/]three-globe[\\/]/.test(importer)) return PREFIX + source
      return null
    },
    load(id) {
      return id.startsWith(PREFIX) ? STUBS[id.slice(PREFIX.length)] : null
    },
  }
}

/**
 * The globe engine is a dynamic import, so by default the browser only discovers three.js after
 * the entry chunk has downloaded and run. Hint those chunks (and atlas.json) from the HTML so
 * everything downloads in parallel while the intro screen paints.
 */
function preloadGlobe(): Plugin {
  let base = '/'
  return {
    name: 'orbis:preload-globe',
    apply: 'build',
    configResolved(c) {
      base = c.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const chunks = Object.values(ctx.bundle ?? {}).filter(
          (c) => c.type === 'chunk' && ['three', 'globe-vendor', 'GlobeEngine'].includes(c.name),
        )
        return [
          { tag: 'link', attrs: { rel: 'preload', href: `${base}data/atlas.json`, as: 'fetch', crossorigin: '' }, injectTo: 'head' },
          ...chunks.map((c) => ({ tag: 'link', attrs: { rel: 'modulepreload', crossorigin: '', href: base + c.fileName }, injectTo: 'head' as const })),
        ]
      },
    },
  }
}

// BASE lets the same build run under a sub-path (e.g. BASE=/atlas/); defaults to /.
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [stubUnusedGlobeLayers(), react(), preloadGlobe()],
  build: {
    // three.js core is ~600 kB minified on its own and cannot be split further.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // The UI shell: paints the intro while the globe engine downloads.
            { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom|scheduler|zustand)[\\/]/, priority: 3 },
            // Long-lived, rarely-changing 3D vendor code, cached separately from app code.
            { name: 'three', test: /[\\/]node_modules[\\/]three[\\/]/, priority: 2 },
            { name: 'globe-vendor', test: /[\\/]node_modules[\\/]/, priority: 1 },
          ],
        },
      },
    },
  },
})

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { renderDocumentation } from './docs.js';

async function readJson(file, fallback) {
  try {
    const value = JSON.parse(await readFile(file, 'utf8'));
    return value == null ? fallback : value;
  } catch (error) {
    if (error.code === 'ENOENT') return fallback;
    throw new Error(`Invalid mock file ${file}: ${error.message}`);
  }
}

function mockSvg(id) {
  const palettes = [['#3f2f28', '#d8baa0'], ['#31505b', '#bcd5d9'], ['#53394f', '#dfbfd6'], ['#635233', '#e4d6ac'], ['#243d35', '#b8d2c5']];
  const index = ['hero', 'image1', 'image2', 'image3', 'image4'].indexOf(id);
  const [dark, light] = palettes[Math.max(0, index) % palettes.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><linearGradient id="g"><stop stop-color="${dark}"/><stop offset="1" stop-color="${light}"/></linearGradient></defs><rect width="1200" height="800" fill="url(#g)"/><circle cx="600" cy="360" r="180" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2"/><text x="600" y="700" fill="#fff" text-anchor="middle" font-family="serif" font-size="34">ENVITE DEVELOPMENT PREVIEW · ${id.toUpperCase()}</text></svg>`;
}

function mockWav() {
  const sampleRate = 8000; const samples = 8000; const dataSize = samples * 2; const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + dataSize, 4); buffer.write('WAVEfmt ', 8); buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22); buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34); buffer.write('data', 36); buffer.writeUInt32LE(dataSize, 40);
  for (let index = 0; index < samples; index++) buffer.writeInt16LE(Math.sin(index / sampleRate * Math.PI * 2 * 220) * 900, 44 + index * 2);
  return buffer;
}

export function enviteMockPlugin(options = {}) {
  const virtualId = 'virtual:envite-mock'; const resolvedId = `\0${virtualId}`;
  let development = false; let root = process.cwd();
  return {
    name: 'envite-mock-data',
    enforce: 'pre',
    configResolved(config) { development = config.command === 'serve'; root = config.root; },
    resolveId(id) { if (id === virtualId) return resolvedId; },
    async load(id) {
      if (id !== resolvedId) return;
      if (!development) return 'export const mockInvitation = null; export const mockAdvertisement = null; export const isMockEnvironment = false;';
      const mockRoot = path.join(root, 'mock');
      const invitation = await readJson(path.join(mockRoot, 'invitation.json'), {});
      const guests = await readJson(path.join(mockRoot, 'guests.json'), {});
      const wishes = await readJson(path.join(mockRoot, 'wishes.json'), {});
      const media = await readJson(path.join(mockRoot, 'media.json'), {});
      const ads = await readJson(path.join(mockRoot, 'ads.json'), {});
      const overrides = { ...invitation, ...(Array.isArray(guests) ? { guests } : guests), ...(Array.isArray(wishes) ? { wishes } : wishes), ...media };
      return `import { createMockAdvertisement, createMockInvitation } from '@envitepkg/template-sdk/mock';\nexport const mockInvitation = createMockInvitation(${JSON.stringify(options.invitationType || 'wedding')}, ${JSON.stringify(overrides)});\nexport const mockAdvertisement = createMockAdvertisement(${JSON.stringify(ads)});\nexport const isMockEnvironment = true;`;
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (request.url?.startsWith('/__envite/docs')) { const language = new URL(request.url, 'http://envite.local').searchParams.get('lang') || 'en'; response.setHeader('content-type', 'text/html; charset=utf-8'); response.end(renderDocumentation(language)); return; }
        const match = request.url?.match(/^\/__envite_mock__\/gallery\/(hero|image[1-4])\.svg$/);
        if (match) { response.setHeader('content-type', 'image/svg+xml'); response.setHeader('cache-control', 'no-store'); response.end(mockSvg(match[1])); return; }
        if (request.url === '/__envite_mock__/music.wav') { response.setHeader('content-type', 'audio/wav'); response.setHeader('cache-control', 'no-store'); response.end(mockWav()); return; }
        next();
      });
    },
    transformIndexHtml(html) { if (!development) return html; return { html, tags: [{ tag:'style', injectTo:'head', children:'.envite-preview-bar{position:fixed;z-index:9999;top:0;left:0;right:0;height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;background:#171717;color:#fcfbf8;font:600 11px/1 system-ui;letter-spacing:.18em}.envite-preview-bar a{color:inherit;text-underline-offset:4px}body{padding-top:44px}' }, { tag:'header', attrs:{class:'envite-preview-bar'}, children:'<span>ENVITE · TEMPLATE PREVIEW</span><a href="/__envite/docs" target="_blank">Docs ↗</a>', injectTo:'body-prepend' }] }; }
  };
}

import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const virtualMockId = 'virtual:envite-mock';
const resolvedVirtualMockId = '\0virtual:envite-mock';
const developmentPluginUrl = pathToFileURL(path.join(process.cwd(), '.envite', 'mock-plugin.js')).href;

function enviteProductionModule() {
  return {
    name: 'envite-production-runtime',
    resolveId(id) { if (id === virtualMockId) return resolvedVirtualMockId; },
    load(id) { if (id === resolvedVirtualMockId) return 'export const mockInvitation = null; export const mockAdvertisement = null; export const isMockEnvironment = false;'; }
  };
}

export default defineConfig(async ({ command }) => {
  const plugins = [];
  if (command === 'serve') {
    const { enviteMockPlugin } = await import(developmentPluginUrl);
    plugins.push(enviteMockPlugin({ invitationType: "wedding" }));
  } else {
    plugins.push(enviteProductionModule());
  }
  plugins.push(react());

  return { plugins, resolve: { dedupe: ['react', 'react-dom'] }, build: { assetsInlineLimit: 4096 } };
});

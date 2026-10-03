/// <reference types="vite/client" />
declare module 'virtual:envite-mock' { import type { AdvertisementState, Invitation } from '@envitepkg/template-sdk'; export const mockInvitation: Invitation | null; export const mockAdvertisement: AdvertisementState | null; export const isMockEnvironment: boolean; }

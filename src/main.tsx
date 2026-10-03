import React from 'react';
import { createRoot } from 'react-dom/client';
import { configureAdvertisement, configureInvitation } from '@envitepkg/template-sdk';
import { I18nProvider } from '@envitepkg/template-sdk/react';
import { mockAdvertisement, mockInvitation } from 'virtual:envite-mock';
import './styles/main.scss';
import { i18nOptions } from './i18n';
import { Template } from './template';

if (import.meta.env.DEV && mockInvitation) configureInvitation(mockInvitation);
if (import.meta.env.DEV && mockAdvertisement) configureAdvertisement(mockAdvertisement);
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Missing #app root element');
createRoot(rootElement).render(<React.StrictMode><I18nProvider options={i18nOptions}><Template /></I18nProvider></React.StrictMode>);

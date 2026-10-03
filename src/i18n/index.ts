import { configureI18n } from '@envitepkg/template-sdk';
import uz from './locales/uz/translation.json';
import ru from './locales/ru/translation.json';
import en from './locales/en/translation.json';

export const i18nOptions = { resources: { uz, ru, en }, supportedLanguages: ['uz', 'ru', 'en'], fallbackLanguage: 'uz' };
const i18n = configureI18n(i18nOptions);
export const { t, setLanguage, getLanguage, subscribe } = i18n;
export type SupportedLanguage = 'uz' | 'ru' | 'en';

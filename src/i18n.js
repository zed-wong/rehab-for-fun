import { register, init } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('zh', () => import('./locales/zh.json'));

init({
  fallbackLocale: 'zh',
  initialLocale: window.localStorage.getItem('locale') || 'zh',
});

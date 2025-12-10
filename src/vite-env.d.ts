/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/svelte" />

declare module 'virtual:pwa-register/svelte' {
  import type { Writable } from 'svelte/store'
  import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: Writable<boolean>
    offlineReady: Writable<boolean>
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>
  }
}

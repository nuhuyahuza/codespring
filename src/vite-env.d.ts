/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_NEXTAUTH_URL: string
  readonly VITE_NEXTAUTH_SECRET: string
  readonly MODE: string
  readonly DEV: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

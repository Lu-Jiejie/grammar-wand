import type OllamaDefault from 'ollama/dist/browser'
import type { ProtocolWithReturn } from 'webext-bridge'

declare module 'webext-bridge' {
  export interface ProtocolMap {
    // define message protocol types
    // see https://github.com/antfu/webext-bridge#type-safe-protocols
    'ollama:generate': ProtocolWithReturn<
      Parameters<typeof OllamaDefault.generate>[0],
      string | null
    >
  }
}

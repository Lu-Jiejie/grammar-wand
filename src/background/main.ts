/* eslint-disable unused-imports/no-unused-vars */
import { Ollama } from 'ollama/dist/browser'
import { onMessage } from 'webext-bridge/background'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

let abortController: AbortController | null = null

onMessage('ollama:generate', async ({ data }) => {
  abortController?.abort()
  abortController = new AbortController()

  const ollama = new Ollama({
    fetch: (url, options) => {
      return fetch(url, {
        ...options,
        signal: abortController!.signal,
      })
    },
  })

  try {
    const result = await ollama.generate(data)
    return result.response
  }
  catch (error) {
    return null
  }
})

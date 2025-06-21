import OllamaDefault, { Ollama } from 'ollama/dist/browser'
import { describe, expect, it } from 'vitest'

describe('ollama browser', () => {
  it.skip('ollama list', async () => {
    try {
      const list = await OllamaDefault.list()
      expect(list.models.map(i => i.name)).toMatchInlineSnapshot(`
        [
          "llama3.1:latest",
          "huihui_ai/deepseek-r1-abliterated:8b",
          "llama3.1:8b",
        ]
      `)
    }
    catch (error) {
      expect(JSON.stringify(error)).toMatchInlineSnapshot()
    }
  })

  it.skip('ollama grammar correct', async () => {
    const abortController = new AbortController()
    const ollama = new Ollama({
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          signal: abortController.signal,
        })
      },
    })

    const rawText = 'I is the most tallest girl in i class.'

    try {
      const result = await ollama.generate({
        model: 'llama3.1:latest',
        prompt: rawText,
        system: `
      You are an English grammar checker. Your sole purpose is to correct grammatical errors in the provided text.
        1. Only output the corrected version of the text.
        2. Do not explain what was wrong or provide any commentary.
        3. Preserve the original meaning, style, and tone.
        4. If the text is already grammatically correct, output it unchanged.
        5. Do not add any additional information.
        6. Preserve contractions and abbreviations in the original text (e.g., "don't" should not become "do not", "I'm" should remain "I'm" not "I am"), unless the contraction itself is grammatically incorrect.
        `,
      })
      expect(result.response).toMatchInlineSnapshot(`"I am the most tall girl in my class."`)
    }
    catch (error) {
      expect(JSON.stringify(error)).toMatchInlineSnapshot()
    }
  })
})

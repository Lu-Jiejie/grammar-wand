import { sendMessage } from 'webext-bridge/content-script'

export class OllamaService {
  private model: string
  private systems: string

  constructor(model?: string, systems?: string) {
    this.model = model || 'llama3.1:latest'
    this.systems = systems || `
    You are a helpful assistant that fixes grammar mistakes and spelling errors in the text provided to you.
    Don't add any explanations or additional information!
    If the text is already correct, just return it as is.
    `
  }

  async fixGrammar(text: string) {
    const result = await sendMessage('ollama:generate', {
      model: this.model,
      prompt: text,
      system: this.systems,
    })
    if (result) {
      return result
    }
    else {
      throw new Error('Failed to fix grammar')
    }
  }
}

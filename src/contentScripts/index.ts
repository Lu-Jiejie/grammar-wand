import { diffWords } from 'diff'
import { OllamaService, safeAwait } from '~/logic'

type EditableElement = HTMLElement | HTMLTextAreaElement
const watcherMap = new Map<EditableElement, Watcher>()

class Watcher {
  private area: EditableElement
  private ollamaService: OllamaService
  private text: string
  private result: string

  constructor(area: EditableElement) {
    this.area = area
    this.ollamaService = new OllamaService()
    this.text = ''
    this.result = ''
  }

  async update() {
    const text = this.area instanceof HTMLTextAreaElement
      ? this.area.value
      : this.area.textContent || ''

    // skip if the text is the same
    if (this.text === text) {
      return
    }

    this.text = text

    // at least 2 words
    if (text.split(/\s+/).length < 2) {
      return
    }

    const result = await safeAwait(this.ollamaService.fixGrammar(text))

    if (this.text !== text) {
      return
    }

    if (!result.success) {
      console.error(result.error)
      return
    }

    this.result = result.value
    console.log('Grammar fixed:', this.result)
    console.log(diffWords(this.text, this.result))
  }
}

function isEditableElement(element: EventTarget): element is EditableElement {
  return (
    element instanceof HTMLTextAreaElement
  )
}

function injector(e: Event) {
  const target = e.target

  if (!target || !isEditableElement(target)) {
    return
  }

  let focusArea = watcherMap.get(target)
  if (!focusArea) {
    focusArea = new Watcher(target)
    watcherMap.set(target, focusArea)
  }

  focusArea.update()

  // console.log('Focus on editable element:', target)
  // console.log(focusAreaMap)
}

function main() {
  document.addEventListener('focus', injector, true)
  document.addEventListener('input', injector)
}

// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
(() => {
  main()
})()

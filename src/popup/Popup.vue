<script setup lang="ts">
import { sendMessage } from 'webext-bridge/popup'
import Browser from 'webextension-polyfill'
import { storageDemo } from '~/logic/storage'

function openOptionsPage() {
  Browser.runtime.openOptionsPage()
}

function test() {
  sendMessage('ollama:generate', {
    model: 'llama3.2:latest',
    prompt: 'test prompt',
  }, 'background')
}
</script>

<template>
  <main class="w-[300px] px-4 py-5 text-center text-gray-700">
    <Logo />
    <div>Popup</div>
    <SharedSubtitle />

    <button class="btn mt-2" @click="openOptionsPage">
      Open Options
    </button>
    <button class="btn mt-2" @click="test">
      Test
    </button>
    <div class="mt-2">
      <span class="opacity-50">Storage:</span> {{ storageDemo }}
    </div>
  </main>
</template>

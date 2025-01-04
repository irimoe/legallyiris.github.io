<template>
  <div class="custom-select" role="combobox" :aria-expanded="isOpen">
    <button
      :style="{ width: buttonWidth }"
      :class="{ 'select-button': true, open: isOpen }"
      @click="toggleOpen"
      aria-haspopup="listbox"
      aria-controls="options-list"
      @blur="handleBlur"
    >
      <span>{{ selectedOption.value }}</span>
      <span class="arrow">&#9660;</span>
    </button>
    <ul
      id="options-list"
      role="listbox"
      class="options-list"
      @keydown.stop="handleKeyDown"
      :class="{ open: isOpen }"
    >
      <li
        v-for="option in options"
        :key="option.value"
        @click="selectOption(option)"
        :class="{ selected: option.value === selectedOption.value }"
        role="option"
        :aria-selected="option.value === selectedOption.value"
        :tabindex="isOpen ? 0 : -1"
      >
        {{ option.value }}
      </li>
    </ul>
  </div>

  <teleport to="body">
    <div @click="toggleOpen" :class="{ backdrop: true, open: isOpen }" />
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useThemeStore, type Theme } from '@/stores/theme'

const themeStore = useThemeStore()
const isOpen = ref(false)
const buttonWidth = ref('100px')

const options: { value: Theme }[] = [
  { value: 'latte' },
  { value: 'frappe' },
  { value: 'macchiato' },
  { value: 'mocha' },
]

const toggleOpen = () => {
  const opened = !isOpen.value
  if (opened) {
    isOpen.value = opened
    const firstItem = document.querySelector('#options-list li')
    if (firstItem);
    ;(firstItem as HTMLElement).focus()
  } else {
    isOpen.value = opened
  }
}

const selectedOption = computed({
  get: () => options.find((option) => option.value === themeStore.theme) || options[0],
  set: (newOption: { value: string }) => themeStore.setTheme(newOption.value as Theme),
})

const selectOption = (option: { value: string }) => {
  selectedOption.value = option
  isOpen.value = false
}

onMounted(async () => {
  await nextTick()

  const optionWidths = options.map((option) => {
    const testElement = document.createElement('span')
    testElement.textContent = option.value
    document.body.appendChild(testElement)
    const width = testElement.offsetWidth + 20
    document.body.removeChild(testElement)
    return width
  })

  buttonWidth.value = `${Math.max(...optionWidths)}px`
})

const handleKeyDown = (event: KeyboardEvent) => {
  if (isOpen.value) {
    const listItems = document.querySelectorAll('.options-list li')
    let currentIndex = Array.from(listItems).indexOf(event.target as HTMLElement)
    if (currentIndex === -1) return

    if (event.key === 'ArrowDown') {
      currentIndex = (currentIndex + 1) % listItems.length
    } else if (event.key === 'ArrowUp') {
      currentIndex = (currentIndex - 1 + listItems.length) % listItems.length
    } else if (event.key === 'Enter' || event.key === ' ') {
      ;(listItems[currentIndex] as HTMLElement).click()
      return
    }
    ;(listItems[currentIndex] as HTMLElement).focus()
  } else if (event.key === 'Enter' || event.key === ' ') {
    toggleOpen()
    nextTick(() => {
      const firstItem = document.querySelector('#options-list li:first-child')
      if (!firstItem) return
      ;(firstItem as HTMLElement).focus()
    })
  }
}

const handleBlur = (event: FocusEvent) => {
  if (!isOpen.value) return
  const relatedTarget = event.relatedTarget as HTMLElement | null
  if (!relatedTarget || !relatedTarget.closest('.options-list')) {
    isOpen.value = false
  }
}
</script>

<style scoped>
.custom-select {
  position: relative;
  display: inline-block;
  background: hsla(var(--surface0) / 0.5);
  border: 2px solid hsla(var(--text) / 0.2);
  border-radius: 50rem;
  z-index: 5;
  transition: 0.2s;

  &:hover,
  &:has(.select-button:focus-visible) {
    background: hsla(var(--surface0) / 0.7);
    border: 2px solid hsla(var(--pink) / 0.7);
  }

  &:active {
    background: hsla(var(--surface0) / 1);
    border: 2px solid hsla(var(--pink) / 1);
    scale: 0.95;
  }
}

button.select-button {
  padding: 0.25rem 0.75rem;
  background: none;
  border: none;
  color: var(--text);
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  justify-content: space-between;
  outline: none;
  font-size: 0.75rem;
}

.options-list {
  position: absolute;
  top: 60%;
  left: 0;
  background: hsla(var(--surface0) / 1);
  border-radius: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  opacity: 0;
  z-index: 1;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  &.open {
    opacity: 1;
    top: calc(100% + 0.5rem);
    pointer-events: auto;
  }
}

.options-list li {
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  color: hsla(var(--subtext1) / 1);
  font-size: 0.75rem;

  &.selected {
    background: hsla(var(--surface1) / 0.5);
  }

  &:hover {
    background: hsla(var(--surface1) / 0.9);
  }

  &:focus-visible {
    background: hsla(var(--surface2) / 1);
    outline: none;
  }
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: brightness(0.6) blur(0.25rem);
  pointer-events: none;
  opacity: 0;
  transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  &.open {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>

export const heroSectionModel = () => {
  const texts = [
    'Jezreel de Andrade',
    'or... you can call me by my nickname',
    'jazz 🎷👀',
  ]

  async function textTypingEffect(element: HTMLElement, text: string) {
    if (!element) return

    element.textContent = '' // Reset content

    for (const char of text) {
      element.textContent += char
      await new Promise((resolve) => setTimeout(resolve, 50)) // Typing delay
    }
  }

  async function textDeletionEffect(element: HTMLElement) {
    if (!element) return

    while (element.textContent && element.textContent.length > 0) {
      element.textContent = element.textContent.slice(0, -1)
      await new Promise((resolve) => setTimeout(resolve, 30)) // Deletion delay
    }
  }
  async function cycleTexts(element: HTMLElement, texts: string[]) {
    let index = 0

    while (true) {
      const text = texts[index]

      await textTypingEffect(element, text) // Type text
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Longer delay after typing
      await textDeletionEffect(element) // Delete text
      index = (index + 1) % texts.length // Move to next text (loop infinitely)
    }
  }

  return { cycleTexts, texts }
}

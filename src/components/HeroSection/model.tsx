export const heroSectionModel = () => {
  const texts = [
    // 'Hello, my name is Jezreel',
    // 'but you can call me jazz',
    'Jezreel de Andrade',
    'woragis',
  ]

  function incrementString(word: string) {}
  function decrementFromString(size: number) {}

  async function textTypingEffect(
    element: HTMLElement,
    text: string,
    i: number = 0
  ) {
    element.textContent += text[i]

    if (i === text.length - 1) return

    setTimeout(() => textTypingEffect(element, text, i + 1), 50)
  }
  async function textDeletionEffect(element: HTMLElement) {
    const currentText = element.textContent || ''
    const currentLength = currentText.length || 0
    if (currentLength === 0) return

    const newText = currentText.slice(0, currentLength - 1)
    element.textContent = newText

    setTimeout(() => textDeletionEffect(element), 50)
  }

  return { textTypingEffect, texts, textDeletionEffect }
}

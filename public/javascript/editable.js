const elements = {
  promptTitle: document.querySelector('[data-prompt-title]'),
  promptContent: document.querySelector('[data-prompt-content]'),
};

/**
 * @param {HTMLElement} element O elemento a ser verificado.
 * @param {string} dataAttributeName O nome do atributo de dados (ex: 'promptTitle').
 */
function updateEditableState(element, dataAttributeName) {
  if (!element) return;

  const hasContent = element.textContent.trim() !== '';

  element.dataset[dataAttributeName] = String(!hasContent);
}

export function updateAllEditableStates() {
  updateEditableState(elements.promptTitle, 'promptTitle');
  updateEditableState(elements.promptContent, 'promptContent');
}

export function attachAllEditableHandlers() {
  if (elements.promptTitle) {
    elements.promptTitle.addEventListener('input', () => updateEditableState(elements.promptTitle, 'promptTitle'));
  }
  if (elements.promptContent) {
    elements.promptContent.addEventListener('input', () => updateEditableState(elements.promptContent, 'promptContent'));
  }
}

export function initEditable() {
  attachAllEditableHandlers();
  updateAllEditableStates();
}

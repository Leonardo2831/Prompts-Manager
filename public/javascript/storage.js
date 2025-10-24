import { updateAllEditableStates } from './editable.js';
import { attachAllEditableHandlers } from './editable.js';
import { closeMenu } from './toggleMenu.js';

const STORAGE_KEY = "prompts_storage";

const state = {
    prompts: [],
    selectedId: null,
};

const elements = {
    promptTitle: document.querySelector('[data-prompt-title]'),
    promptContent: document.querySelector('[data-prompt-content]'),
    buttonSave: document.querySelector("[data-button-save]"),
    promptList: document.querySelector("[data-prompt-saved]"),
    copyButton: document.querySelector("[data-button-copy]"),
    buttonNewPrompt: document.querySelector("[data-new-prompt]"),
    inputSearch: document.querySelector("[data-input-search]"),
};

function save() {
    const title = elements.promptTitle.textContent.trim();
    const content = elements.promptContent.innerHTML.trim();
    const hasContent = elements.promptContent.textContent.trim();

    if (!title || !hasContent) {
        alert("Título e conteúdo não podem estar vazios.");
        return;
    }

    if (state.selectedId) {
        const existingPrompt = state.prompts.find((prompt) => prompt.id === state.selectedId);

        if (existingPrompt) {
            existingPrompt.title = title || "Sem título";
            existingPrompt.content = content || "Sem conteúdo";
        }
    } else {
        const newPrompt = {
            id: Date.now().toString(36),
            title,
            content,
        }

        state.prompts.unshift(newPrompt)
        state.selectedId = newPrompt.id
    }

    renderList(elements.inputSearch.value);
    persist();
    alert("Prompt salvo com sucesso!");
}

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts));
    } catch (error) {
        console.log("Erro ao salvar no localStorage:", error);
    }
}

function load() {
    try {
        const storage = localStorage.getItem(STORAGE_KEY);
        state.prompts = storage ? JSON.parse(storage) : [];
        state.selectedId = null;
    } catch (error) {
        console.log("Erro ao carregar do localStorage:", error);
    }
}

function createPromptItem(prompt) {
    const description = prompt.content.replace(/<[^>]*>/g, " ").trim();

    return `
        <li class="prompt-item" data-id="${prompt.id}" data-action="select">
            <div class="prompt-item-content">
                <span class="prompt-item-title">${prompt.title}</span>
                <span class="prompt-item-description">${description}...</span>
            </div>
            <button class="btn-icon" title="Remover" data-action="remove">
                <img src="public/images/remove.svg" alt="Remover" class="icon" />
            </button>
        </li>
    `;
}

function renderList(filterText = "") {
    elements.promptList.innerHTML = "";

    const filteredPrompts = state.prompts
        .filter((prompt) =>
            prompt.title.toLowerCase().includes(filterText.toLowerCase().trim())
        );

    if(filteredPrompts.length === 0){
        elements.promptList.innerHTML = "<p class='empty-list'>Nenhum prompt encontrado.</p>";
        return;
    }
    
    elements.promptList.innerHTML += filteredPrompts
        .map((prompt) => createPromptItem(prompt))
        .join("");
}

function newPrompt() {
    state.selectedId = null;
    elements.promptTitle.textContent = "";
    elements.promptContent.textContent = "";
    updateAllEditableStates();
    elements.promptTitle.focus();
}

function copyPrompt(){
    try {
        
        if(!navigator.clipboard){
            alert("Navegador não suporta a API de Clipboard.");
            return;
        }

        if(elements.promptContent.innerText.trim()) {
            navigator.clipboard.writeText(elements.promptContent.innerText);
            alert("Conteúdo copiado para a área de transferência!"); 
        } else {
            alert("Nenhum conteúdo para copiar.");
        }
    } catch (error) {
        console.log("Erro ao copiar para a área de transferência:", error)
    }
}

export default function initStorage(){
    load();
    renderList('');

    updateAllEditableStates();
    attachAllEditableHandlers();

    elements.copyButton.addEventListener("click", copyPrompt);
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'c') {
            event.preventDefault();
            copyPrompt();
        }
    });

    elements.buttonSave.addEventListener("click", save);
    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === 's'){
            event.preventDefault();
            save();
        } 
    });

    elements.buttonNewPrompt.addEventListener("click", newPrompt);

    elements.inputSearch.addEventListener("input", (event) => renderList(event.target.value));

    elements.promptList.addEventListener("click", (event) => {
        const removeBtn = event.target.closest("[data-action='remove']");
        const item = event.target.closest("[data-id]");
        
        if (!item) return;

        const id = item.getAttribute("data-id");
        state.selectedId = id;

        if (removeBtn) {
            state.prompts = state.prompts.filter((prompt) => prompt.id !== id);
            renderList(elements.inputSearch.value);
            persist();
            return;
        }

        if (event.target.closest("[data-action='select']")) {
            const prompt = state.prompts.find((prompt) => prompt.id === id);

            if (prompt) {
                elements.promptTitle.textContent = prompt.title;
                elements.promptContent.innerHTML = prompt.content;
                updateAllEditableStates();
                closeMenu();
            }
        }
    });
}

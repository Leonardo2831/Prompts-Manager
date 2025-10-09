const openMenuButton = document.querySelector('[data-button-menu="open"]');
const closeMenuButton = document.querySelector('[data-button-menu="close"]');
const sidebar = document.querySelector('.sidebar');

function openMenu() {
    sidebar.classList.add('active');
}

export function closeMenu() {
    sidebar.classList.remove('active');
}

/** @param {MouseEvent} target */
function handleClickOutside({target}) {
    if (!sidebar.contains(target) && !target.closest('[data-button-menu="open"]') && document.body.contains(target)) {
        closeMenu();
    }
}

export function initToggleMenu() {
    openMenuButton.addEventListener('click', openMenu);
    closeMenuButton.addEventListener('click', closeMenu);
    document.addEventListener('click', handleClickOutside);
}
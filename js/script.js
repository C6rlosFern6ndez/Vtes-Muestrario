// Estado global de la aplicación
let cardsData = []; 

const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const folderFilter = document.getElementById("folderFilter");

/**
 * Inicializa la aplicación cargando el recurso externo
 */
async function init() {
    try {
        const response = await fetch('./cards.json'); // Carga asíncrona
        if (!response.ok) throw new Error("No se pudo cargar el JSON");
        
        cardsData = await response.json();
        
        populateFolderFilter();
        renderCards(cardsData);
        
        searchInput.addEventListener("input", filterCards);
        folderFilter.addEventListener("change", filterCards);
    } catch (error) {
        console.error("Error en el runtime:", error);
        cardContainer.innerHTML = `<div class="loader">Error al cargar datos: ${error.message}</div>`;
    }
}

function populateFolderFilter() {
    folderFilter.innerHTML = "<option value=\"\">Todas las carpetas</option>";
    const folders = [...new Set(cardsData.map(card => card.folder))].filter(Boolean);
    folders.sort().forEach(folder => {
        const option = document.createElement("option");
        option.value = folder;
        option.textContent = folder;
        folderFilter.appendChild(option);
    });
}

function renderCards(cards) {
    cardContainer.innerHTML = "";
    if (cards.length === 0) {
        cardContainer.innerHTML = "<div class=\"loader\">No hay coincidencias.</div>";
        return;
    }

    const fragment = document.createDocumentFragment(); // Optimización de renderizado
    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        cardElement.innerHTML = `
            <div class="card-image-container">
                <img src="${card.image}" alt="${card.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/250x350?text=Error'">
            </div>
            <div class="card-info">
                <div class="card-name">${card.name}</div>
                <div class="card-folder">${card.folder}</div>
            </div>`;
        fragment.appendChild(cardElement);
    });
    cardContainer.appendChild(fragment);
}

function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedFolder = folderFilter.value;

    const filteredCards = cardsData.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm);
        const matchesFolder = selectedFolder === "" || card.folder === selectedFolder;
        return matchesSearch && matchesFolder;
    });

    renderCards(filteredCards);
}

document.addEventListener("DOMContentLoaded", init);
/**
 * Script de gestión de cartas VTES
 * Maneja la carga dinámica, filtrado y visualización de fichas de personaje.
 */

let cardsData = []; // Buffer para los datos del JSON

// Referencias a elementos del DOM
const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("searchInput");
const folderFilter = document.getElementById("folderFilter");
const clanFilter = document.getElementById("clanFilter");
const modal = document.getElementById("cardModal");
const closeModalBtn = document.querySelector(".close-modal");

/**
 * Inicialización de la aplicación
 */
async function init() {
    try {
        // Carga los datos desde el archivo externo cards.json
        const response = await fetch('./cards.json');
        if (!response.ok) throw new Error("Error al cargar el repositorio de cartas.");
        
        cardsData = await response.json();
        
        populateFolderFilter();
        populateClanFilter();
        renderCards(cardsData);
        
        // Listeners para filtros
        searchInput.addEventListener("input", filterCards);
        folderFilter.addEventListener("change", filterCards);
        clanFilter.addEventListener("change", filterCards);
        
        // Listener para cerrar modal
        closeModalBtn.addEventListener("click", () => modal.style.display = "none");
        window.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });

    } catch (error) {
        console.error("Critical Error:", error);
        cardContainer.innerHTML = `<div class="loader">Muerte definitiva: ${error.message}</div>`;
    }
}

/**
 * Genera las opciones del select basadas en las carpetas existentes (solo Aliados y Combate)
 */
function populateFolderFilter() {
    folderFilter.innerHTML = "<option value=\"\">Aliados y Combate</option>";
    
    // Solo mostramos Aliados y Combat en este filtro
    const allowedFolders = ["Aliados", "Combat"];
    
    allowedFolders.sort().forEach(folder => {
        const option = document.createElement("option");
        option.value = folder;
        option.textContent = folder;
        folderFilter.appendChild(option);
    });
}

/**
 * Genera las opciones del select basadas en los clanes existentes
 */
function populateClanFilter() {
    clanFilter.innerHTML = "<option value=\"\">Todos los clanes</option>";
    const clans = [...new Set(cardsData.map(card => card.clan))].filter(Boolean);
    
    clans.sort().forEach(clan => {
        const option = document.createElement("option");
        option.value = clan;
        option.textContent = clan;
        clanFilter.appendChild(option);
    });
}

/**
 * Renderiza el grid de cartas
 */
function renderCards(cards) {
    cardContainer.innerHTML = "";
    
    if (cards.length === 0) {
        cardContainer.innerHTML = "<div class=\"loader\">No se han encontrado vástagos con esos criterios.</div>";
        return;
    }

    const fragment = document.createDocumentFragment();

    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        
        cardElement.innerHTML = `
            <div class="card-image-container">
                <img src="${card.image}" alt="${card.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/250x350?text=Censurado'">
            </div>
            <div class="card-info">
                <div class="card-name">${card.name}</div>
                <div class="card-folder">${card.folder}</div>
            </div>
        `;

        // Evento para abrir la ficha detallada
        cardElement.addEventListener("click", () => openCharacterSheet(card));
        fragment.appendChild(cardElement);
    });

    cardContainer.appendChild(fragment);
}

/**
 * Abre el modal con la historia del personaje
 */
function openCharacterSheet(card) {
    document.getElementById("modalImg").src = card.image;
    document.getElementById("modalName").textContent = card.name;
    document.getElementById("modalFolder").textContent = `Categoría: ${card.folder}${card.clan ? ` | Clan: ${card.clan}` : ''}`;
    
    // Si no existe descripción en el JSON, muestra un texto por defecto
    const bio = card.description || "Los archivos de la Camarilla no contienen información sobre este sujeto.";
    document.getElementById("modalDescription").textContent = bio;
    
    modal.style.display = "block";
}

/**
 * Filtra los datos según el input del usuario
 */
function filterCards() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedFolder = folderFilter.value;
    const selectedClan = clanFilter.value;

    // Log descriptivo para depuración
    console.log(`Filtrando por: "${searchTerm}", Categoría: "${selectedFolder}", Clan: "${selectedClan}"`);

    const filteredCards = cardsData.filter(card => {
        const matchesSearch = card.name.toLowerCase().includes(searchTerm) || 
                             (card.clan && card.clan.toLowerCase().includes(searchTerm));
        const matchesFolder = selectedFolder === "" || card.folder === selectedFolder;
        const matchesClan = selectedClan === "" || card.clan === selectedClan;
        
        return matchesSearch && matchesFolder && matchesClan;
    });

    renderCards(filteredCards);
}

// Entry point
document.addEventListener("DOMContentLoaded", init);

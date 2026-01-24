const fs = require('fs');
const path = require('path');

// Configuración de rutas
const imagesDir = './Imagenes'; 
const outputJsonFile = 'cards.json';

// Cargar el JSON actual para preservar las descripciones
let existingCards = [];
if (fs.existsSync(outputJsonFile)) {
    try {
        existingCards = JSON.parse(fs.readFileSync(outputJsonFile, 'utf8'));
    } catch (e) {
        console.error(">>> Error al leer el archivo cards.json existente.");
    }
}

const cardsData = [];

/**
 * Escanea el directorio de imágenes y genera el array de objetos para el JSON.
 * @param {string} currentDir - Directorio actual a procesar.
 */
function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(currentDir, item.name);
        
        if (item.isDirectory()) {
            scanDirectory(itemPath);
        } else if (item.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)) {
            const webPath = itemPath.replace(/\\/g, '/');
            const pathParts = webPath.split('/');
            const folderName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "General";

            let clan = null;
            if (pathParts.includes('Personajes')) {
                const personajesIndex = pathParts.indexOf('Personajes');
                if (pathParts.length > personajesIndex + 2) {
                    clan = pathParts[personajesIndex + 1];
                }
            }

            const fileName = path.parse(item.name).name;
            const formattedName = fileName
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());

            // Buscar si ya existe esta carta para preservar su descripción
            const existingCard = existingCards.find(c => c.image === webPath);
            const description = existingCard ? existingCard.description : "";

            console.log(`Indexando: ${formattedName} [Categoría: ${folderName}${clan ? `, Clan: ${clan}` : ''}]`);

            cardsData.push({
                name: formattedName,
                folder: folderName,
                clan: clan,
                image: webPath,
                description: description
            });
        }
    }
}

try {
    console.log(">>> Iniciando escaneo de imágenes...");
    
    if (!fs.existsSync(imagesDir)) {
        throw new Error(`El directorio ${imagesDir} no existe.`);
    }

    scanDirectory(imagesDir);

    fs.writeFileSync(
        outputJsonFile, 
        JSON.stringify(cardsData, null, 4), 
        'utf8'
    );

    console.log(`>>> Success: '${outputJsonFile}' generado.`);
    console.log(`>>> Total de cartas indexadas: ${cardsData.length}`);

} catch (error) {
    console.error(`>>> Critical Error: ${error.message}`);
}

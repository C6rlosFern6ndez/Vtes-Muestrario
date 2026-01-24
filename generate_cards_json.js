const fs = require('fs');
const path = require('path');

// Configuración de rutas
const imagesDir = './Imagenes'; 
const outputJsonFile = 'cards.json';

const cardsData = [];

/**
 * Escanea el directorio de imágenes y genera el array de objetos para el JSON.
 * @param {string} currentDir - Directorio actual a procesar.
 */
function scanDirectory(currentDir) {
    // Lectura síncrona de los elementos del directorio
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
        const itemPath = path.join(currentDir, item.name);
        
        if (item.isDirectory()) {
            // Recursividad para subcarpetas (ej. Aliados, Personajes)
            scanDirectory(itemPath);
        } else if (item.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(item.name)) {
            
            // Calculamos la ruta relativa respecto a la raíz del proyecto
            // Reemplazamos barras invertidas (Windows) por barras inclinadas (Web)
            const webPath = itemPath.replace(/\\/g, '/');
            
            // Extraemos la categoría (nombre de la carpeta padre inmediata)
            const pathParts = webPath.split('/');
            const folderName = pathParts.length > 2 ? pathParts[pathParts.length - 2] : "General";

            // Extraemos el clan si está dentro de la carpeta Personajes
            // Estructura: Imagenes/Personajes/Clan/Archivo.png
            let clan = null;
            if (pathParts.includes('Personajes')) {
                const personajesIndex = pathParts.indexOf('Personajes');
                // Si hay algo después de 'Personajes' y no es el archivo en sí
                if (pathParts.length > personajesIndex + 2) {
                    clan = pathParts[personajesIndex + 1];
                }
            }

            // Limpieza del nombre del archivo (quitamos extensión y formateamos)
            const fileName = path.parse(item.name).name;
            const formattedName = fileName
                .replace(/[-_]/g, ' ')
                .replace(/\b\w/g, char => char.toUpperCase());

            // Añadir log descriptivo en español
            console.log(`Indexando: ${formattedName} [Categoría: ${folderName}${clan ? `, Clan: ${clan}` : ''}]`);

            cardsData.push({
                name: formattedName,
                folder: folderName,
                clan: clan,
                image: webPath
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

    // Escribir el buffer al archivo físico
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

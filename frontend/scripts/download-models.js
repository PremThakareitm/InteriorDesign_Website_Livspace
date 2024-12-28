import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelUrls = {
  'sofa.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/sofa-01/model.gltf',
  'tv-unit.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/tv-stand-2/model.gltf',
  'coffee-table.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/coffee-table-1/model.gltf',
  'bed.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/bed-01/model.gltf',
  'wardrobe.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/wardrobe-01/model.gltf',
  'nightstand.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/nightstand-01/model.gltf',
  'kitchen-island.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/kitchen-island/model.gltf',
  'kitchen-cabinets.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/kitchen-cabinets/model.gltf',
  'kitchen-appliances.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/kitchen-appliances/model.gltf',
  'office-desk.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/desk-1/model.gltf',
  'office-chair.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/office-chair-1/model.gltf',
  'bookshelf.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/bookshelf-01/model.gltf',
  'dining-table.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dining-table-01/model.gltf',
  'dining-chairs.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dining-chair-01/model.gltf',
  'chandelier.glb': 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/chandelier-01/model.gltf'
};

const modelsDir = path.join(__dirname, '..', 'public', 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

Object.entries(modelUrls).forEach(([filename, url]) => {
  const filePath = path.join(modelsDir, filename);
  const file = fs.createWriteStream(filePath);

  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded: ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {});
    console.error(`Error downloading ${filename}:`, err.message);
  });
});

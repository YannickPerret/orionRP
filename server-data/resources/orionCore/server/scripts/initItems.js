// server/scripts/initItems.js
const fs = require('fs');
const path = require('path');
const Item = require('./server/models/Item.js');

async function initItems() {
    const itemRepository = AppDataSource.getRepository(Item);

    // Déterminer le chemin absolu vers le fichier items.json
    const itemsFilePath = path.join(__dirname, '..', 'datas', 'items.json');

    // Vérifier si le fichier existe
    if (!fs.existsSync(itemsFilePath)) {
        console.error(`Le fichier items.json n'a pas été trouvé à l'emplacement : ${itemsFilePath}`);
        return;
    }

    // Charger les items depuis le fichier JSON
    const itemsData = JSON.parse(fs.readFileSync(itemsFilePath, 'utf-8'));

    for (const itemData of itemsData) {
        let item = await itemRepository.findOne({ where: { name: itemData.name } });
        if (!item) {
            item = itemRepository.create(itemData);
            await itemRepository.save(item);
            console.log(`Item "${item.name}" créé.`);
        } else {
            console.log(`Item "${item.name}" existe déjà.`);
        }
    }
};

module.exports = initItems;
// server/events/itemEvents.js
const itemController = require('../controllers/itemController');

onNet('core:useItem', async (itemId) => {
    const _source = global.source;
    await itemController.useItem(_source, itemId);
});

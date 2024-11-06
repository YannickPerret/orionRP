// server/events/itemEvents.js
import itemController from '../controllers/Item';

onNet('core:useItem', async (itemId) => {
    const _source = global.source;
    await itemController.useItem(_source, itemId);
});

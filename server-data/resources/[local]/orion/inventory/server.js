exports('orion:inventory:s:createUsableItem', (item, cb) => {
    let usableItem = new UsableItem(item);
    usableItem.create();
    cb(usableItem);
});

exports('orion:inventory:s:removeUsableItem', (item) => {
    item.destroy();
});

exports('orion:inventory:s:useItem', (item) => {
    item.use();
});
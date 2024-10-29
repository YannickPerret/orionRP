window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.action === 'updateInventory') {
        updateInventory(data.inventory);
    } else if (data.action === 'showInventory') {
        document.body.style.display = 'block';
    }
});

function updateInventory(inventory) {
    const inventoryDiv = document.getElementById('inventory');
    inventoryDiv.innerHTML = '';

    inventory.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        const img = document.createElement('img');
        img.src = itemData[item.id].image;
        const name = document.createElement('p');
        name.textContent = itemData[item.id].name + ' x' + item.quantity;

        itemDiv.appendChild(img);
        itemDiv.appendChild(name);

        // Ajouter un événement de clic pour utiliser l'item
        itemDiv.addEventListener('click', () => {
            fetch(`https://${GetParentResourceName()}/useItem`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({ itemId: item.id })
            });
        });

        inventoryDiv.appendChild(itemDiv);
    });
}

// Fermer l'inventaire
document.getElementById('close-btn').addEventListener('click', () => {
    fetch(`https://${GetParentResourceName()}/closeInventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({})
    });
    document.body.style.display = 'none';
});

// Données des items pour l'interface (doit correspondre aux items du serveur)
const itemData = {
    'bread': {
        name: 'Pain',
        image: 'images/bread.png',
    },
    'water': {
        name: 'Eau',
        image: 'images/water.png',
    },
    'phone': {
        name: 'Téléphone',
        image: 'images/phone.png',
    },
    // Ajoutez d'autres items ici
};

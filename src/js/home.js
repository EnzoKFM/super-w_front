let produits = [];

// Récupérer le panier depuis localStorage ou tableau vide par défaut
const panierItems = JSON.parse(localStorage.getItem('panier')) || [];

fetch("http://localhost:5000/product/list", {
    method: "GET",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
})
.then(res => res.json())
.then(data => {
    if(data.data_content.length == 0){
        document.getElementById("listProduits").innerHTML = "Aucun produit"
    } else {
        produits = data.data_content.map(produit => {
            const card = document.querySelector("[data-product-template]").content.cloneNode(true).children[0]
            card.querySelector("[data-page]").href = `http://localhost:3000/page_produit?id=${produit.id}`
            card.querySelector("[data-name]").textContent = produit.name
            card.querySelector("[data-description]").textContent = produit.description
            card.querySelector("[data-image]").src = produit.images[0].url
            card.querySelector("[data-price]").textContent = produit.price + " €"
            card.querySelector("[data-button]").onclick = function() { 
                const index = panierItems.findIndex(item => item.produit.id === produit.id);
                if (index !== -1) {
                    // Produit déjà dans le panier : on augmente la quantité
                    panierItems[index].quantite++;
                } else {
                    // Nouveau produit ajouté
                    panierItems.push({ produit, quantite: 1 });
                }
                afficherPanier();
            }
            document.querySelector("[data-product-cards-container]").append(card)
            return {name: produit.name, category: produit.category, element: card}
        })
    }
})

function modifierQuantite(index, nouvelleQuantite) {
    if (nouvelleQuantite <= 0) {
        panierItems.splice(index, 1);
    } else {
        panierItems[index].quantite = nouvelleQuantite;
    }
    afficherPanier();
}

function afficherPanier() {
    document.getElementById('panier').innerHTML = panierItems.map((item, index) => `
        <li class="flex justify-between items-center border-b py-2">
            <span>${item.produit.name}</span>
            <div class="flex items-center gap-2">
                <button onclick="modifierQuantite(${index}, ${item.quantite - 1})" class="text-red-500 font-bold px-2 cursor-pointer">-</button>
                <span>${item.quantite}</span>
                <button onclick="modifierQuantite(${index}, ${item.quantite + 1})" class="text-green-500 font-bold px-2 cursor-pointer">+</button>
                <span>${item.produit.price * item.quantite} €</span>
                <span onclick="retirerProduit(${index})" class="cursor-pointer" >
                    <img src="../img/remove.png" class="max-h-5">
                </span>
            </div>
        </li>
    `).join('');

    document.getElementById('total').textContent = panierItems.reduce((sum, item) => sum + item.produit.price * item.quantite, 0);

    // Sauvegarde dans localStorage
    localStorage.setItem('panier', JSON.stringify(panierItems));
}

function togglePanier() {
    document.getElementById('panierOverlay').classList.toggle('hidden');
}

function retirerProduit(index) {
    panierItems.splice(index,1)
    afficherPanier();
}

afficherPanier();

document.getElementById("search-bar").addEventListener('input', event => {
    const value = event.target.value.toLowerCase()
    produits.forEach(produit => {
        const isVisible = produit.name.toLowerCase().includes(value) || produit.category.toLowerCase().includes(value)
        produit.element.classList.toggle("hidden", !isVisible)
    })
})
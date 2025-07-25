let indexImage = 0;
let imagesProduit = [];

document.getElementById('changeImageDown').addEventListener('click', () => {
    changeImage(-1)
});

document.getElementById('changeImageUp').addEventListener('click', () => {
    changeImage(1)
});

function showImage() {
    const imgElement = document.getElementById("carousel-image");
    imgElement.src = imagesProduit[indexImage].url;
}

function changeImage(direction) {
    indexImage = (indexImage + direction + imagesProduit.length) % imagesProduit.length;
    showImage();
}

// Récupérer l'ID depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const produitId = parseInt(urlParams.get('id'));

fetch(`http://localhost:5000/product/details?id=${produitId}`, {
    method: "GET",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
})
.then(res => res.json())
.then(produit => {
    if (produit) {
        document.getElementById("name-produit").textContent = produit.data_content.name;
        document.getElementById("description-produit").textContent = produit.data_content.description;
        document.getElementById("price-produit").textContent = produit.data_content.price;

        imagesProduit = produit.data_content.images;
        // Initialisation
        showImage();
        setInterval(() => changeImage(1), 4000);
    } else {
        document.body.innerHTML = "<h2>Produit introuvable</h2>";
    }
})
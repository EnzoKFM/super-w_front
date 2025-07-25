function setToast(message, type) {
    localStorage.setItem("pendingToast", JSON.stringify({ message, type }));

    window.location.reload();
}

document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem("token");
    window.location.href = "/";
});

document.getElementById('rapport-csp').addEventListener('click', () => {
    window.location.href = "/csp";
});

let produits = [];

// On vérifie si l'utilisateur est connecté
const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "/connection";
}

window.addEventListener("DOMContentLoaded", () => {
    const storedToast = localStorage.getItem("pendingToast");
    if (storedToast) {
        const { message, type } = JSON.parse(storedToast);

        // Affiche le toast
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: type,
            },
        }).showToast();

        // Supprime après affichage
        localStorage.removeItem("pendingToast");
    }
});

fetch("http://localhost:5000/csrf/generate_token", {
    method: "GET",
})
    .then(data => {
        const csrfToken = data.headers.get('X-CSRF-token');
        document.getElementById('csrf-token-create').value = csrfToken
        document.getElementById('csrf-token-modify').value = csrfToken
        document.getElementById('csrf-token-delete').value = csrfToken
    })

fetch("http://localhost:5000/product/list", {
    method: "GET",
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
})
    .then(res => res.json())
    .then(data => {
        if(data) {
            if(data.data_content.length == 0){
                document.getElementById("div-modify").remove()
                document.getElementById("div-delete").remove()
                document.getElementById("div-base").classList.remove("grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3")
            } else {
                data.data_content.forEach(produit => {
                    const option = document.createElement('option');
                    option.value = produit.id;
                    option.textContent = produit.name;

                    const option2 = document.createElement('option');
                    option2.value = produit.id;
                    option2.textContent = produit.name;

                    document.getElementById('product-select-modify').appendChild(option);
                    document.getElementById('product-select-delete').appendChild(option2);
                })

                produits = data.data_content
            }
        }
        
    })

document.getElementById('product-select-modify').addEventListener("change", () => {
    const produitChoisi = produits.find(p => p.id == document.getElementById('product-select-modify').value);

    if (produitChoisi) {
        document.getElementById('change_name').value = produitChoisi.name
        document.getElementById('change_description').value = produitChoisi.description
        document.getElementById('change_price').value = produitChoisi.price
        document.getElementById('change_category').value = produitChoisi.category
    }
});

document.getElementById('product-form-create').addEventListener('submit', async function(e) {
    e.preventDefault(); // Empêche l’envoi classique du form

    const formData = new FormData(this);

    const csrfToken = formData.get('csrf_token')

    await fetch('http://localhost:5000/product/new', {
        method: 'PUT',
        headers: {
        'X-CSRF-token': csrfToken,
        'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    setToast("Produit crée", "linear-gradient(to right, #40d130, #17870b)")
});

document.getElementById('product-form-modify').addEventListener('submit', async function(e) {
    e.preventDefault(); // Empêche l’envoi classique du form

    const formData = new FormData(this);

    const payload = {
        name: formData.get('name'),
        description: formData.get('description'),
        images: formData.get('images'),
        price: parseInt(formData.get('price')),
        category: formData.get('category'),
        id: produits.find(p => p.id == document.getElementById('product-select-modify').value).id
    };

    const csrfToken = formData.get('csrf_token')

    await fetch('http://localhost:5000/product/update', {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRF-token': csrfToken,
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    setToast("Produit modifié", "linear-gradient(to right, #f2ef33, #b8b50b)")
});

document.getElementById('product-form-delete').addEventListener('submit', async function(e) {
    e.preventDefault(); // Empêche l’envoi classique du form

    const formData = new FormData(this);

    const payload = {
        id: formData.get('productId')
    };

    const csrfToken = formData.get('csrf_token')

    await fetch('http://localhost:5000/product/delete', {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'X-CSRF-token': csrfToken,
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    setToast("Produit supprimé", "linear-gradient(to right, #c92424, #9c0505)");
});
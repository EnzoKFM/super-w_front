const calculerTotalPanier = (produits) => {
    return produits.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
}

const extraireUrlsImages = produit => {
    return Array.isArray(produit.images) ? produit.images.map(img => img.url) : [];
}

const genererResumeProduit = produit => {
    return `${produit.name} - ${produit.price}€ (${produit.category})`;
}

const genererStatsParCategorie = produits => {
    return produits.reduce((acc, produit) => {
        const nom = produit.category || "Inconnue";
        const existant = acc.find(c => c.nom === nom);
        if (existant) {
            existant.compte++;
        } else {
            acc.push({ nom, compte: 1 });
        }
        return acc;
    }, []);
};

module.exports = {
    calculerTotalPanier,
    extraireUrlsImages,
    genererResumeProduit,
    genererStatsParCategorie
};

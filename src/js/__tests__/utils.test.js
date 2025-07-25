const {
    calculerTotalPanier,
    extraireUrlsImages,
    genererResumeProduit,
    genererStatsParCategorie
} = require("../utils.js");

describe("Tests unitaires", () => {

    const produits = [
        {
            id: 1,
            name: "Chaise",
            description: "Ohhh la jolie chaise!",
            category: "Meuble",
            images: [{ id: 1, url: "url1" }],
            price: 50,
            createdAt: new Date()
        },
        {
            id: 2,
            name: "Balle",
            description: "Grosse baballe",
            category: "Sport",
            images: [{ id: 2, url: "url2" }, { id: 3, url: "url3" }],
            price: 12,
            createdAt: new Date()
        },
        {
            id: 3,
            name: "Haltères",
            description: "Pour des gros muscles!",
            category: "Sport",
            images: [{ id: 4, url: "url4" }],
            price: 30,
            createdAt: new Date()
        },
        {
            id: 4,
            name: "Pomme",
            description: "Ben une pomme quoi",
            category: "Alimentation",
            images: [],
            price: 1,
            createdAt: new Date()
        }
    ];

    test("calculerTotalPanier calcule le total avec quantités", () => {
        const panier = [
            { product: produits[0], quantity: 1 },
            { product: produits[1], quantity: 2 }
        ];
        expect(calculerTotalPanier(panier)).toBe(50 + (12 * 2));
    });

    test("extraireUrlsImages retourne les URLs", () => {
        const urls = extraireUrlsImages(produits[1]);
        expect(urls).toEqual(["url2", "url3"]);
    });

    test("genererResumeProduit crée un résumé formaté", () => {
        const resume = genererResumeProduit(produits[3]);
        expect(resume).toBe("Pomme - 1€ (Alimentation)");
    });

    test("genererStatsParCategorie retourne les bons comptes", () => {
        const stats = genererStatsParCategorie([...produits, produits[1]]);
        expect(stats).toEqual([
            { nom: "Meuble", compte: 1 },
            { nom: "Sport", compte: 3 },
            { nom: "Alimentation", compte: 1 }
        ]);
    });

});
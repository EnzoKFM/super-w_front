const form = document.getElementById("register-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Compte créé avec succès !");
            window.location.href = "/connection";
        } else {
            if (data.errors) {
                const messages = Object.values(data.errors).join("\n");
                alert(messages);
            } else {
                alert(data.message || "Erreur lors de l'inscription");
            }
        }
    } catch (err) {
        console.error(err);
        alert("Erreur serveur");
    }
});
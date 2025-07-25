const form = document.getElementById("login-form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            alert("Connexion réussie !");
            window.location.href = "/dashboard";
        } else {
            if (data.errors) {
                const messages = Object.values(data.errors).join("\n");
                alert(messages);
            } else {
                alert(data.message || "Erreur lors de la connexion.");
            }
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
        alert("Erreur serveur");
    }
});
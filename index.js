const express = require('express');
const helmet = require('helmet')
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'src')));
app.use(
    helmet.contentSecurityPolicy({
        directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "https://cdn.jsdelivr.net/npm/toastify-js"],
        "style-src": ["'self'", "https://cdn.jsdelivr.net/npm/toastify-js"],
        "img-src": ["'self'", "localhost:5000"],
        "connectSrc": ["'self'", 'http://localhost:5000'],
        "report-uri": "http://localhost:5000/csp-report"
        },
    })
)

// Autres protections Helmet (optionnel mais conseillé)
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use(helmet.hidePoweredBy())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'home.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'dashboard.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'register.html'));
});

app.get('/connection', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'connection.html'));
});

app.get('/page_produit', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'page_produit.html'));
});

app.get('/csp', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'pages', 'csp.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur Express lancé sur http://localhost:${PORT}`);
});
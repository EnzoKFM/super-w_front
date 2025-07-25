fetch('http://localhost:5000/csp-report/get-json', {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})
.then(res => res.json())
.then(data => {
    const ul = document.getElementById('report-list');
    data.forEach(entry => {
        const li = document.createElement('li');
        const time = new Date(entry.timestamp).toLocaleString();
        li.innerHTML = `<strong>${time}</strong><pre>${JSON.stringify(entry.report, null, 2)}</pre>`;
        ul.appendChild(li);
    });
})
.catch(() => {
document.body.innerHTML = '<p>Impossible de charger les rapports CSP.</p>';
});
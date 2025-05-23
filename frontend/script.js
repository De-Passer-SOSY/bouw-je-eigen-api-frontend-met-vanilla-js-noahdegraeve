document.addEventListener('DOMContentLoaded', init);

function init() {
    fetchVoertuigen();

    // Formulier en knop selecteren
    const form = document.getElementById('voertuigen-form');
    const formWrapper = document.getElementById('form-wrapper');
    const openFormBtn = document.getElementById('openForm');

    // Klik op "Nieuwe Afwezigheid" toont het formulier
    openFormBtn.addEventListener('click', () => {
        formWrapper.classList.remove('hidden');               // Formulier zichtbaar maken
        form.scrollIntoView({ behavior: 'smooth' });          // Automatisch scrollen naar het formulier
        resetForm();                                          // Leeg maken voor nieuw item
    });

    // Formulierverzending afhandelen
    form.addEventListener('submit', handleFormSubmit);
}

// Haal afwezigheden op van de backend en sorteer op datum aflopend
function fetchVoertuigen() {
    fetch('http://localhost:3333/voertuigen')
        .then(res => res.json())
        .then(data => {
            const sorted = data.sort((a, b) => new Date(b.merk) - new Date(a.merk));
            renderVoertuigen(sorted);
        });
}

// Vul de tabel en koppel knoppen
function renderVoertuigen(voertuigen) {
    const list = document.getElementById('voertuiglijst');
    list.innerHTML = '';

    voertuigen.forEach(voertuig => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td>${voertuig.merk}</td>
      <td>${voertuig.type}</td>
      <td>${voertuig.categorie}</td>
      <td>
        <button class="editBtn" data-id="${voertuig.id}">✏️ Wijzig</button>
        <button class="deleteBtn" data-id="${voertuig.id}">🗑️ Verwijder</button>
      </td>
    `;

        // Voeg event listeners toe aan knoppen
        row.querySelector('.editBtn').addEventListener('click', () => editVoertuig(voertuig.id));
        row.querySelector('.deleteBtn').addEventListener('click', () => deleteVoertuig(voertuig.id));

        list.appendChild(row);
    });
}

// Formulier verzenden → toevoegen of bijwerken
function handleFormSubmit(e) {
    e.preventDefault();

    const id = document.getElementById('voertuigId').value;
    const voertuig = {
        merk: document.getElementById('merk').value,
        type: document.getElementById('type').value,
        categorie: document.getElementById('categorie').value,

    };

    const method = id ? 'PUT' : 'POST';
    const url = id
        ? `http://localhost:3333/updateVoertuig/${id}`
        : 'http://localhost:3333/newVoertuig';

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(voertuig)
    })
        .then(() => {
            showAlert(id ? '✏️ voertuig bijgewerkt!' : '✅ voertuig toegevoegd!', 'success');
            resetForm();
            fetchVoertuigen();
            document.getElementById('formWrapper').classList.add('hidden'); // Verberg formulier
        })
        .catch(() => showAlert('❌ Er ging iets mis.', 'error'));
}

// Vult het formulier met de bestaande gegevens van een afwezigheid
function editVoertuig(id) {
    fetch(`http://localhost:3333/voertuig/${id}`)
        .then(res => res.json())
        .then(voertuig => {
            document.getElementById('voertuigId').value = voertuig.id;
            document.getElementById('merk').value = voertuig.merk;
            document.getElementById('type').value = voertuig.type;
            document.getElementById('categorie').value = voertuig.categorie;
            document.getElementById('formWrapper').classList.remove('hidden');
            document.getElementById('voertuigForm').scrollIntoView({ behavior: 'smooth' });
        });
}

// Verwijder een afwezigheid
function deleteVoertuig(id) {
    fetch(`http://localhost:3333/deleteVoertuig/${id}`, { method: 'DELETE' })
        .then(() => {
            showAlert('🗑️ voertuig verwijderd.', 'success');
            fetchVoertuigen();
        })
        .catch(() => showAlert('❌ Verwijderen mislukt.', 'error'));
}

// Reset het formulier en ID-veld
function resetForm() {
    document.getElementById('voertuigId').value = '';
    document.getElementById('voertuigForm').reset();
}

// Toon melding bovenaan
function showAlert(message, type = 'success') {
    const alertBox = document.getElementById("alert");
    alertBox.textContent = message;
    alertBox.className = `alert ${type}`;
    alertBox.classList.remove('hidden');
    setTimeout(() => alertBox.classList.add('hidden'), 3000);
}

const container = document.getElementById('alertesContainer');
const form = document.getElementById('formAlerta');


// ___________________________________LISTAR LAS ALERTAS_______________________________

async function carregarAlertes() {
    const res = await fetch('/api/alertes');
    const alertes = await res.json();

    container.innerHTML = '';

    alertes.forEach(alerta => {
        const div = document.createElement('div');
        div.classList.add('card');

        div.innerHTML = `
            <h3>${alerta.tipus}</h3>
            <p><strong>Nivell:</strong> ${alerta.nivell}</p>
            <p><strong>Àrea:</strong> ${alerta.area}</p>
            <p>${alerta.descripcio}</p>
            <p><strong>Activa:</strong> ${alerta.activa}</p>
            <button data-id="${alerta._id}" class="deleteBtn">Eliminar</button>
            <button data-id="${alerta._id}" class="editBtn">Editar</button>
        `;

        container.appendChild(div);
    });
}


// ___________________________________CREAR LA ALERTA__________________________________

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novaAlerta = {
        tipus: tipus.value,
        nivell: nivell.value,
        area: area.value,
        descripcio: descripcio.value,
        activa: activa.checked
    };

    await fetch('/api/alertes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaAlerta)
    });

    form.reset();
    carregarAlertes();
});


// ____________________________________ELIMINAR y EDITAR____________________________
container.addEventListener('click', async (e) => {

    if (e.target.classList.contains('deleteBtn')) {
        const id = e.target.dataset.id;

        await fetch(`/api/alertes/${id}`, {
            method: 'DELETE'
        });

        carregarAlertes();
    }

    if (e.target.classList.contains('editBtn')) {
        const id = e.target.dataset.id;

        const nouNivell = prompt("Nou nivell:");
        if (!nouNivell) return;

        await fetch(`/api/alertes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nivell: nouNivell })
        });

        carregarAlertes();
    }
});

carregarAlertes();
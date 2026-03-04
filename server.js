const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = './alertes.json';

// Ler los datos
const readData = () => {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

// Escribir los datos
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};


//_____________________________________ 1 LISTAR_____________________________________

app.get('/api/alertes', (req, res) => {
    res.json(readData());
});


// ______________________________________2 CREAR___________________________________

app.post('/api/alertes', (req, res) => {
    const dades = readData();

    const novaAlerta = {
        id: Date.now().toString(),
        ...req.body
    };

    dades.push(novaAlerta);
    writeData(dades);

    res.status(201).json(novaAlerta);
});


// ________________________________________3 EDITAR________________________________

app.put('/api/alertes/:id', (req, res) => {
    let dades = readData();

    const index = dades.findIndex(a => a.id === req.params.id);

    if (index !== -1) {
        dades[index] = { ...dades[index], ...req.body };
        writeData(dades);
        res.json(dades[index]);
    } else {
        res.status(404).send("No trobat");
    }
});

// ______________________________________4 ELIMINAR_________________________________
app.delete('/api/alertes/:id', (req, res) => {
    let dades = readData();

    dades = dades.filter(a => a.id !== req.params.id);
    writeData(dades);

    res.json({ missatge: "Eliminat" });
});

// Arrancar gservidor
app.listen(3000, () => {
    console.log("Servidor a http://localhost:3000");
});
require('dotenv').config();
const express = require('express');
const { MongoClient} = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = new MongoClient(process.env.MONGO_URI);

async function connectarDB() {
    try {
        await client.connect();
        console.log("Connectat a MongoDB Atlas");

        const db = client.db('meteoDB');
        const alertesCol = db.collection('alertes');

        app.get('/api/alertes', async (req, res) => {
            const resultat = await alertesCol.find().toArray();
            res.json(resultat);
        });

        app.listen(3000, () => {
            console.log("Servidor a http://localhost:3000");
        });

    } catch (err) {
        console.error("Error connectant a Mongo:", err);
    }
}

connectarDB();
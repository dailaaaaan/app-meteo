require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = new MongoClient(process.env.MONGO_URI);

async function connectarDB() {
    try {
        await client.connect();

        const db = client.db('meteoDB');
        const alertesCol = db.collection('alertes');

        console.log("Connectat a MongoDB Atlas");

        // GET
        app.get('/api/alertes', async (req, res) => {
            const resultat = await alertesCol.find().toArray();
            res.json(resultat);
        });

        // POST
        app.post('/api/alertes', async (req, res) => {
            const resultat = await alertesCol.insertOne(req.body);
            res.status(201).json(resultat);
        });

        // PUT
        app.put('/api/alertes/:id', async (req, res) => {
            await alertesCol.updateOne(
                { _id: new ObjectId(req.params.id) },
                { $set: req.body }
            );
            res.json({ missatge: "Actualitzat" });
        });

        // DELETE
        app.delete('/api/alertes/:id', async (req, res) => {
            await alertesCol.deleteOne(
                { _id: new ObjectId(req.params.id) }
            );
            res.json({ missatge: "Eliminat" });
        });

        app.listen(process.env.PORT, () => {
            console.log(`Servidor a http://localhost:${process.env.PORT}`);
        });

    } catch (error) {
        console.error(error);
    }
}

connectarDB();
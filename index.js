const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;



// MIDDLEWARE
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster-01.qwgvzig.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('coreDentalReview').collection('services');
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/home/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get('/services/:id', async (req, res) => {
            const query = { _id: ObjectId() };
            const service = serviceCollection.findOne(query);
            res.send(service);
        })
    }
    finally {

    }
}

run().catch(error => {
    console.log(error);
})


app.get('/', (req, res) => {
    res.send('Core Dental Review server is running');
})
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})
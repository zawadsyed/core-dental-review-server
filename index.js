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
        const reviewCollection = client.db('coreDentalReview').collection('reviews');


        // All Services Api
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/home/services', async (req, res) => {
            const query = {};
            // for showing new added service in homepage
            const cursor = serviceCollection.find(query).sort({ _id: -1 });
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        // for adding new service to homepage
        app.post('/home/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            console.log(result)
            res.send(result);
        })

        // for service details
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            console.log(service);
            res.send(service);
        })


        // reviews api

        // api for my reviews
        app.get('/my-reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // individual reviews to get for update
        app.get('/my-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollection.findOne(query);
            res.send(review);
        })

        // getting reviews according to the relevant services
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.service_id) {
                query = {
                    service_id: req.query.service_id
                }
            }
            // reviews in descending order
            const cursor = reviewCollection.find(query).sort({ _id: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        })


        //  api for adding review
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        // reviews delete
        app.delete('/my-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })
        // review update
        app.put('/my-reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true }
            const updatedReview = {
                $set: {
                    review: review.review
                }
            }
            const result = await reviewCollection.updateOne(filter, updatedReview, option)
            res.send(result);
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
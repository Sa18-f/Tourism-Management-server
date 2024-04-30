const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());

// tourismManagement
// dWIkPOqZpJqssUze
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.byauspy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const spotsCollection = client.db('spotsDB').collection('spots');
        const countriesCollection = client.db('spotsDB').collection('countries');

        app.get('/spots', async (req, res) => {
            const cursor = spotsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });
        // view details page
        app.get('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.findOne(query);
            res.send(result)
        });
        // Update
        app.put('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedSpot = req.body;
            const spot = {
                $set: {
                    tourists_spot_name: updatedSpot.tourists_spot_name,
                    country_Name: updatedSpot.country_Name,
                    seasonality: updatedSpot.seasonality,
                    photo: updatedSpot.photo,
                    travel_time: updatedSpot.travel_time,
                    average_cost: updatedSpot.average_cost, totalVisitorsPerYear: updatedSpot.totalVisitorsPerYear
                }
            };
            const result = await spotsCollection.updateOne(filter, spot, options);
            res.send(result)
        });
        // spots collection
        app.post('/spots', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotsCollection.insertOne(newSpot);
            res.send(result)
        });

        // my list page
        app.get("/myList/:email", async (req, res) => {
            const result = await spotsCollection.find({ email: req.params.email }).toArray();
            res.send(result)
        })

        // delete from my list page
        app.delete('/spots/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await spotsCollection.deleteOne(query);
            res.json(result);
        });
        // country Details
        app.get('/countries/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await countriesCollection.findOne(query);
            res.send(result)
        });

        // country get
        app.get('/countries', async (req, res) => {
            const countries = await countriesCollection.find().toArray();
            res.json(countries);
        });
        // Country post
        app.post('/countries', async (req, res) => {
            const countries = req.body;
            const result = await countriesCollection.insertOne(countries);
            res.json(result);
        });        
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Tourism management server is running')
})

app.listen(port, () => {
    console.log(`Tourism management server is running on port: ${port}`)
})
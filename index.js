const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/spots', async (req, res) => {
            const cursor = spotsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        });

        app.post('/spots', async (req, res) => {
            const newSpot = req.body;
            console.log(newSpot);
            const result = await spotsCollection.insertOne(newSpot);
            res.send(result)
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
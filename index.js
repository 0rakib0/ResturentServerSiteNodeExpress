const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()


// middlware 
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSOWRD}@cluster0.zoyeiku.mongodb.net/?retryWrites=true&w=majority`;

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


        const menuCollection = client.db("BistroDB").collection("menu")
        const ReviewCollection = client.db("BistroDB").collection("Reviews")


        app.get('/menu', async(req, res) =>{
            const result = await menuCollection.find().toArray()
            res.send(result)
        })

        app.get('/review', async(req, res) =>{
            const result = await ReviewCollection.find().toArray()
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World..')
})

app.listen(port, () => {
    console.log('My Server Running..........')
})
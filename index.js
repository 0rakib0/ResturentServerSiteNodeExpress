const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors')
require('dotenv').config()


// middlware 
app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


        const userCollection = client.db("BistroDB").collection("user")
        const menuCollection = client.db("BistroDB").collection("menu")
        const ReviewCollection = client.db("BistroDB").collection("Reviews")
        const CardCollection = client.db("BistroDB").collection("CardItem")

        // usr section

        app.post('/user', async(req, res) =>{
            const user = req.body
            const query = {email: user.email}
            const CheckExiting = await userCollection.findOne(query)
            if(CheckExiting){
                return {message:'User Already Exist', insertedId: null}
            }
            const result = await userCollection.insertOne(user)
            res.send(result)
        })


        app.get('/menu', async(req, res) =>{
            const result = await menuCollection.find().toArray()
            res.send(result)
        })

        app.get('/review', async(req, res) =>{
            const result = await ReviewCollection.find().toArray()
            res.send(result)
        })

        // product card section

        app.get('/cards', async(req, res) =>{
            const email = req.query.email
            const query = {user: email}
            const result = await CardCollection.find(query).toArray()
            res.send(result)
        })
        app.delete('/cards/:id', async(req, res) =>{
            const Id = req.params.id
            const query = {_id: new ObjectId(Id)}
            const result = await CardCollection.deleteOne(query)
            res.send(result)
        })

        app.post('/cards', async(req, res) =>{
            const Item = req.body
            const result = await CardCollection.insertOne(Item)
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
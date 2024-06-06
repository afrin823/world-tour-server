const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vadwj9m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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

    const countryCollection = client.db("countryDB").collection('country');
   
    app.get('/country', async(req, res) => {
      const cursor = countryCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/country/one/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await countryCollection.findOne(query);
      res.send(result);
    })
    app.post('/country', async(req, res) => {
      const newCountry = req.body;
      console.log(newCountry)
      const result = await countryCollection.insertOne(newCountry);
      res.send(result)
    })
    app.get('/countries/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email}
      const cursor = countryCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })
  
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
    res.send('turist is runnig')
})

app.listen(port, () => {
    console.log(`turist server is running on port: ${port}`)
})
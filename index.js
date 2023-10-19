const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
// dotenv configuration
require('dotenv').config()

// Json body parser
app.use(express.json());
// requests for resources to an external back-end server
app.use(cors());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vjc6ohr.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db('brewBite');
    const prodCollection = database.collection('products');

    // Find multiple document/all data from database
    app.get('/products', async(req, res)=> {
        const allProducts = prodCollection.find();
        const result = await allProducts.toArray();
        res.send(result);
    })
    
    // Insert document/data to database from client side 
    app.post('/products', async(req, res)=> {
        const product = req.body;
        const result = await prodCollection.insertOne(product)
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







app.get('/', (req, res)=> {
    res.send('BreBite Server is running')
})

app.listen(port, ()=> {
    console.log(`BrewBite app running on port: ${port}`);
})

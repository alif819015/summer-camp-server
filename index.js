const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xnalm4u.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();
    
const usersCollection= client.db("SummerCampDB").collection('users');
const campCollection= client.db("SummerCampDB").collection('topClass');
const instractoreCollection= client.db("SummerCampDB").collection('instractore');
const cartsCollection= client.db("SummerCampDB").collection('carts');

// user related api 
app.post('/users', async(req, res) =>{
  const user = req.body;
  const result = await usersCollection.insertOne(user);
  res.send(result);
})


// class
    app.get('/topClass', async(req, res) =>{
        const result = await campCollection.find().toArray();
        res.send(result);
    })

    // instractore
    app.get('/instractore', async(req, res) =>{
      const result = await instractoreCollection.find().toArray();
      res.send(result);
  })

  // cart collection 
app.get('/carts', async(req, res) =>{
  const email = req.query.email;
  if(!email){
    res.send([]);
  }
  const query = {email: email};
  const result = await cartsCollection.find(query).toArray();
  res.send(result);
})

  app.post('/carts', async(req, res) =>{
    const menu = req.body;
    const result = await cartsCollection.insertOne(menu);
    res.send(result);
  })

  app.delete('/carts/:id', async(req, res) =>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await cartsCollection.deleteOne(query);
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



app.get("/", (req,res) => {
    res.send("summer camp server is running")
})

app.listen(port, () =>{
    console.log(`summer camp is running: ${port}`)
})
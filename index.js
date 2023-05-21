const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2l3te9a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    // Send a ping to confirm a successful connection
    const toyGalleryCollection = client.db("toyInvasion").collection("toyGallery");
    const toysCollection = client.db("toyInvasion").collection("toys");
    //toyGallery
    app.get("/toyGallery", async (req, res) => {
      const result = await toyGalleryCollection.find().toArray();
      res.send(result);
    });
    //toys

 
    app.get('/toys', async (req, res) => {
        const { category, email, limit } = req.query;
      
        let query = {};
      
        if (category) {
          query.category = category;
        }
      
        if (email) {
          query.email = email;
        }
      
        let result;
      
        if (category) {
          result = await toysCollection.find(query).toArray();
        } else if (limit) {
          result = await toysCollection.find().limit(parseInt(limit)).toArray();
        } else {
          result = await toysCollection.find(query).toArray();
        }
      
        res.send(result);
      });
      
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    //toy add
    app.post("/toys", async (req, res) => {
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Mighty Toys Respowned");
});
app.listen(port);

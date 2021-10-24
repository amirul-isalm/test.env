const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
require('dotenv').config();

const port =process.env.DB_PORT
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.jgifu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("pactiseDatabase");
      const myData = database.collection("dataCollection");
    //   post data
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await myData.insertOne(user);
      res.json(result);
    });
// get data
      app.get("/users", async (req, res) => {
          const result = await myData.find({}).toArray()
          res.json(result)
      })
    //   delete data
      app.delete("/users/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) }
          const result = await myData.deleteOne(query);
          
          res.json(result)
      })

    //   put data
      app.get("/users/:id", async (req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) }
          const result = await myData.findOne(query);
          console.log(result)
          res.json(result)
      })

      app.put("/users/:id", async (req, res) => {
          const id = req.params.id;
          const updateUser = req.body;
          const query = { _id: ObjectId(id) };
              const options = { upsert: true };

          const document = {
              $set: {
                  name: updateUser.name
                  ,
                  dob: updateUser.dob,
                  age:updateUser.age
              }
          }
          const result = await myData.updateOne(query, document, options)
        res.json(result)
})

    // finally
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("HI i am learning web");
});
app.listen(port, () => {
  console.log("HI your server port is", port);
});

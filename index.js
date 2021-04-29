const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dl4gc.mongodb.net/adven-tour?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const packageCollection = client.db("adven-tour").collection("packages");
  const testimonialCollection = client.db("adven-tour").collection("testimonial");
  const orderCollection = client.db("adven-tour").collection("orders");

  app.get("/getFeaturedPackages", (req, res) => {
    packageCollection
      .find({})
      .limit(3)
      .toArray((err, data) => res.send(data));
  });
  app.get("/getPackages", (req, res) => {
    packageCollection.find({}).toArray((err, data) => res.send(data));
  });
  //getOrders
  app.get("/getPackage", (req, res) => {
    console.log(req.query.id);
    const id = req.query.id;
    packageCollection.find({ _id: ObjectId(id) }).toArray((err, data) => res.send(data[0]));
  });
  app.get("/getOrders", (req, res) => {
    const email = req.query.email;
    orderCollection.find({ email }).toArray((err, data) => res.send(data));
  });

  app.get("/deleteProduct", (req, res) => {
    packageCollection.deleteOne({ _id: ObjectId(req.query.id) }).then((delRes) => res.send(delRes));
  });
  app.get("/getAllOrders", (req, res) => {
    orderCollection.find({}).toArray((err, data) => res.send(data));
  });

  app.get("/getFeaturedTestimonials", (req, res) => {
    testimonialCollection
      .find({})
      .limit(3)
      .toArray((err, data) => res.send(data));
  });
  app.get("/getTestimonials", (req, res) => {
    testimonialCollection.find({}).toArray((err, data) => res.send(data));
  });
  app.post("/submitReview", (req, res) => {
    testimonialCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/submitPackage", (req, res) => {
    packageCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/placeOrder", (req, res) => {
    orderCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  console.log("Connected Succesfully");
});

app.listen(process.env.PORT || port);

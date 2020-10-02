const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectID;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://project-1:Coronacovid19@cluster0.38uxi.mongodb.net/project-1?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true ,  useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

client.connect(err => {
  const collection = client.db("project-1").collection("products");

  app.get('/products', (req, res) => {
    collection.find({}).limit(5)
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })
  
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    collection.insertOne(product)
    .then(result => {
      console.log('data added successfully');
      // res.send('success')
      res.redirect('/')
    })
  })

  app.get('/product/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
  })

  app.patch('/update/:id', (req, res) => {

    collection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result => {
      res.send(result.modifiedCount > 0);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then( result => {
      res.send(result.deletedCount > 0);
      // console.log(result);
    })
  })

  // const product = { name: 'honey', price: 25, quantity: 20 };
//   console.log('database connected');
//   client.close();
});


app.listen(3000);
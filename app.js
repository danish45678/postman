'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const Joi = require('joi');


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://danish:At#H46x>@cluster0.vma7rgk.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

const app = express();

// app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://Danish12:Danish@cluster0.vma7rgk.mongodb.net/stationaryDB");

const productSchema = Joi.object().keys({
    productid : Joi.number().min(3).max(30).required(),
    productquantity: Joi.number().min(3).max(30).required(),
    productname: Joi.string().min(3).max(30).required(),
    productprice: Joi.number().min(3).max(30).required()
});

const Product = mongoose.model("Product",productSchema);

app.route('/products');
app.get('/products', function(req,res) {
    Product.find(function(err, foundProducts){
       if(!err){
        res.send(foundProducts);
       } else {
        res.send(err);
       }
    })
});

//insert

app.post('/products', function(req,res){
    console.log();
    console.log();

    const newProduct = new Product({
    productid: req.body.productid,
    Productname: req.body.productname
});

    newProduct.save(function(err){
        if(!err){
            res.send("successfully added new item");
           } else {
            res.send(err)
           }
    });
});

// delete all items
app.delete('/products',function(req,res){
    Product.deleteMany(function(err){
        if (!err){
          res.send("Successfully deleted all the articles in products.");
        } else {
          res.send(err);
        }
      });
})

/////////////////////////Individual Articles///////////////////////////////////

app.route("/products/:productsID")

.get(function(req, res){
    const productsID = req.params.productsID;
    Product.findOne({title: productsID}, function(err, products){
      if (products){
        const jsonProduct = JSON.stringify(products);
        res.send(jsonProduct);
      } else {
        res.send("No article with that title found.");
      }
    });
  })

  .patch(function(req, res){
    const productsID = req.params.productsID;
    Product.update(
      {productid: productsID},
      {productname: req.body.newContent},
      function(err){
        if (!err){
          res.send("Successfully updated selected productname.");
        } else {
          res.send(err);
        }
      });
  })

  .put(function(req, res){

    const productsID = req.params.productsID;
  
    Product.update(
        {productid: productsID},
        {productname: req.body.newContent},
        {overwrite: true},
      function(err){
        if (!err){
          res.send("Successfully updated the content of the selected article.");
        } else {
          res.send(err);
        }
      });
  })
  
  
  .delete(function(req, res){
    const productsID = req.params.productsID;
    Product.findOneAndDelete({title: productsID}, function(err){
      if (!err){
        res.send("Successfully deleted selected product.");
      } else {
        res.send(err);
      }
    });
  });

  // agreegation
  app.route("/products/:productQuantity")

  .get(function(req, res){
    const productQuantity = req.params.productQuantity;
    Product.aggregate(
        [ { $group: {
             productid: null,
             Price:       { $sum: { $add: ["$productprice"] } },
             Quantity:   { $sum: { $add: ["$productquantity"] },
             
         }}
     }])}, function(err){
        if (!err){
          res.send("Successfully deleted selected product.");
        } else {
          res.send(err);
        }
      })


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

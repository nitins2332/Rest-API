const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/Sample")
  .then(() => {
    console.log("connected with Mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.json());

const productSchema = new mongoose.Schema({
  name: String,
  discription: String,
  price: Number,
});

const Product = new mongoose.model("product", productSchema);

// Create Product
app.post("/abi/v1/product/new", async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// Read Product
app.get("/abi/v1/products", async (req, res) => {
  const products = await Product.find();

  res.status(200).json({ seccess: true, products });
});

// Update Product
app.put("/abi/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      seccess: false,
      message: "product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete Product
app.delete("/abi/v1/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(500).json({
      seccess: false,
      message: "product not found",
    });
  }

  await product.remove();

  res.status({
    success: true,
    message: "Product is deleted successfully",
  });
});

app.listen(4500, () => {
  console.log(`server is working`);
});

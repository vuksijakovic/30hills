const express = require('express');
const app = express();
const fetch = require('node-fetch');
const cors = require('cors'); 

const port = 3000;

let productsArray = [];

app.use(cors()); 

app.use(express.static('public'));

app.get('/fetch-products', async (req, res) => {
  try {
    const response = await fetch("https://30hills.com/api/products.json");
    const data = await response.json();
    productsArray = data.products.data.items.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      features: item.features,
      price: item.price,
      keywords: item.keywords,
      url: item.url,
      category: item.category,
      subcategory: item.subcategory,
      images: item.images,
    }));

    res.json({ success: true, message: 'Products fetched successfully.' });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.get('/get-products', (req, res) => {
  res.json(productsArray);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

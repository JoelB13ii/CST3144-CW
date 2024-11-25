const express = require('express');
const mongoose = require('mongoose');

// Initialize the app
const app = express();
const port = 5000;

app.use(express.json());

// Updated connection string with 'Webstore' database
const dbURI = 'mongodb+srv://joelbinny2003:Joel0144@cluster0.gprvzai.mongodb.net/Webstore';

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Webstore database');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    availableInventory: Number,
    rating: Number,
    location: String,
}, { collection: 'Products' });

const Product = mongoose.model('Product', productSchema);

// Test route
app.get('/', (req, res) => {
    res.send('Backend is working!');
});

// Products route
app.get('/products', async (req, res) => {
    try {
        console.log('Attempting to fetch products from Webstore/Products...');
        const products = await Product.find();
        console.log('Number of products found:', products.length);
        console.log('Fetched products:', products);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products: ' + err);
    }
});

// Debug route
app.get('/debug', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({
            database: mongoose.connection.db.databaseName,
            collections: collections.map(c => c.name)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
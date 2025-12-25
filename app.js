const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const products = require('./routes/products');
const admins = require('./routes/admins');

app.use(express.json());
app.use('/products',products);
app.use('/admins',admins);

app.listen(PORT,()=>{
    console.log(`app open on http://localhost:${PORT}`);
})
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const app = express();
app.use(bodyParser.json());

app.use('/api/authors', require('./routes/authorRoute'));
app.use('/api/books', require('./routes/bookRoute'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
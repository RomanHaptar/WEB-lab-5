const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 3000;
const { errorHandler } = require('./middleware/errorHandler');

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/users', require('./routes/userRoute'));

app.use(express.static(path.join(__dirname, '../client')));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

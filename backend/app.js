import dotenv from 'dotenv';

dotenv.config();

import fs from 'node:fs/promises'; //The fs module in Node.js provides file system operations. The fs/promises version enables async/await for reading and writing files.
import mongoose from 'mongoose';
import bodyParser from 'body-parser'; //Middleware used to parse incoming JSON requests.
import express from 'express'; //express: Web framework for Node.js to create APIs and handle HTTP requests.
import Order from './model/orders.js'; // Import Mongoose Order model
import path from 'node:path';
import User from './model/users.js';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.resolve('/public')));

// app.use((req, res, next) => { //Cross-Origin Resource Sharing Middleware.
//   res.setHeader('Access-Control-Allow-Origin', '*'); //Access-Control-Allow-Origin: '*' means any website can access your API.
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); //This tells the browser which request types are allowed.
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); //Specifies which headers can be included in the request.
//   next();
// });



app.use(express.json());

app.get('/meals', async (req, res) => {
  const meals = await fs.readFile('./data/available-meals.json', 'utf8');
  res.json(JSON.parse(meals));
});

app.post('/orders', async (req, res) => {
  const orderData = req.body.order;

  if (orderData === null || orderData.items === null || orderData.items.length === 0) {
    return res
      .status(400)
      .json({ message: 'Missing data.' });
  }

  if (
    orderData.customer.email === null ||
    !orderData.customer.email.includes('@') ||
    orderData.customer.name === null ||
    orderData.customer.name.trim() === '' ||
    orderData.customer.street === null ||
    orderData.customer.street.trim() === '' ||
    orderData.customer.postalCode === null ||
    orderData.customer.postalCode.trim() === '' ||
    orderData.customer.city === null ||
    orderData.customer.city.trim() === ''
  ) {
    return res.status(400).json({
      message:
        'Missing data: Email, name, street, postal code or city is missing.',
    });
  }

  const newOrder = await Order.create({
    items: orderData.items,
    customer: orderData.customer,
    orderId: (Math.random() * 1000).toString() // Generate a random order ID
  });
  
  res.status(201).json({ message: 'Order created!' });
});

app.post('/signup', async (req, res) => {
  const { email, fullName, phNumber, address, password } = req.body;

    if(
      email === null ||
    !email.includes('@') ||
    fullName === null ||
    fullName.trim() === '' ||
    phNumber === null ||
    phNumber.trim() === '' ||
    address === null ||
    address.trim() === ''
  ){
    return res.status(400).json({
      message:
        'Missing data: Email, name, phNumber, address is missing.',
    });
  }

  console.log(req.body);

  const newUser = await User.create({
    fullName,
    email,
    phNumber,
    address,
    password,
  });
  res.status(201).json({ message: 'User Registered!' });
});

app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true // If using cookies/auth
}));

app.options('*', cors()); // Ensure preflight requests are handled properly

app.use((req, res) => {
  if (req.method === 'OPTIONS') { //OPTIONS is a special type of HTTP request sent by browsers before making certain API requests (like POST, PUT, or DELETE). This is called a preflight request in CORS (Cross-Origin Resource Sharing).
    return res.sendStatus(200);
  }

  res.status(404).json({ message: 'Not found' });
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Connection Error:", err));

app.listen(PORT);


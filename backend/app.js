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
import cookieParser from "cookie-parser";
import { validateToken } from './util/auth.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));

// app.use((req, res, next) => { //Cross-Origin Resource Sharing Middleware.
//   res.setHeader('Access-Control-Allow-Origin', '*'); //Access-Control-Allow-Origin: '*' means any website can access your API.
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); //This tells the browser which request types are allowed.
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); //Specifies which headers can be included in the request.
//   next();
// });

app.use(cors({
  origin: ["http://localhost:5173", "https://fooders-codebase.onrender.com"], //  Allow requests from ANY origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true // If using cookies/auth
}));

app.use(express.json());

app.options('*', cors()); // Ensure preflight requests are handled properly

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

  const newOrder = await Order.create({
    items: orderData.items,
    orderId: (Math.random() * 1000).toString() // Generate a random order ID
  });
  
  return res.status(201).json({ message: 'Order created!' });
});

app.post('/signup', async (req, res) => {
  const { Signupemail, fullName, phNumber, address, Signuppassword } = req.body;

    if(
      Signupemail === null ||
    !Signupemail.includes('@') ||
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
    email: Signupemail,
    phNumber,
    address,
    password: Signuppassword,
  });
  res.status(201).json({ message: 'User Registered!', redirect: '/' });
});
app.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      const token = await User.authenticateUser(email, password);
      res.cookie("token", token, {
        httpOnly: true,       // Prevents client-side access
        secure: true,         // Must be true for cross-site cookies
        sameSite: "None",     // Allows cross-origin authentication
        domain: "fooders-backend-lccf.onrender.com", // Ensure it's set correctly
      });
      res.status(200).json({ message: "Login successful", token, redirect: "/" });
  } catch (error) {
      res.status(401).json({ message: error.message });
  }
});

app.get("/auth/check", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  res.json({ authenticated: true, token });
});

app.get('/user/profile', async (req, res) => {
  try {
      const token = req.cookies.token; 
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const payload = validateToken(token); 
      res.status(200).json(payload);
      
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

app.post('/logout', (req, res) => {
      res.clearCookie("token", {
    httpOnly: true,
    secure: true,  // Ensures it works over HTTPS
    sameSite: "None",  // Allows cross-origin deletion
    domain: "fooders-backend-lccf.onrender.com", // Match backend domain
    path: "/"  // Ensure it's deleted from all routes
  });
});

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

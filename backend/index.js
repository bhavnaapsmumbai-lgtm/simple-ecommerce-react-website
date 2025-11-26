import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Hardcoded user (demo)
const user = {
  id: 1,
  username: "atuny0",
  password: "9uQFF1Lh",
  token: "demo-token-123" // simple token for demo
};

// Hardcoded products
const products = [
  { id: 1, name: "Product 1", price: 500, discountPercentage: 10 },
  { id: 2, name: "Product 2", price: 800, discountPercentage: 15 },
  { id: 3, name: "Product 3", price: 300, discountPercentage: 5 }
];

// Cart storage (in memory)
let carts = {}; // { userId: [items] }

// ---------------- Routes ------------------

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    return res.json({ user: { id: user.id, username: user.username }, token: user.token });
  }
  res.status(401).json({ message: "Invalid username or password" });
});

// Get products
app.get("/products", (req, res) => {
  res.json(products);
});

// Get cart for a user
app.get("/cart/:userId", (req, res) => {
  const { userId } = req.params;
  const cart = carts[userId] || [];
  res.json(cart);
});

// Save cart for a user
app.post("/cart", (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items) {
    return res.status(400).json({ message: "Missing userId or items" });
  }
  carts[userId] = items;
  res.json({ message: "Cart saved successfully" });
});

// Confirm order
app.post("/order", (req, res) => {
  const { userId, items } = req.body;
  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ message: "No items to order" });
  }

  console.log(`Order received from user ${userId}:`, items);

  // Clear cart after order
  carts[userId] = [];

  res.json({ message: `Order confirmed! Total ₹${items.reduce((total, item) => total + ((item.price - (item.price * item.discountPercentage)/100) * item.quantity), 0)}` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

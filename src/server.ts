import express from "express";
import { supabase } from "./supabase.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Checkout Engine API is running"
  });
});

//testing db
app.get("/test-db", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

//creating order
app.post("/orders", async (req, res) => {
  const { customerName, productName, quantity, totalAmount } = req.body;

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: customerName,
        product_name: productName,
        quantity: quantity,
        total_amount: totalAmount
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.status(201).json(data);
});

//fetchin' orders
app.get("/orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
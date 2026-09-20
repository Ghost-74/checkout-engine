import express from "express";
import { supabase } from "./supabase.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Checkout Engine API is running"
  });
});

//testin' the db
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

//creatin' order
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

//fetchin' orders while also filterin'
app.get("/orders", async (req, res) => {
  const status = req.query.status as string | undefined;

  let query = supabase
    .from("orders")
    .select("*");

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({
      error: error.message
    });
  }

  res.json(data);
});

//specific order findin'

app.get("/orders/:order_id", async (req, res) => {
  const { order_id } = req.params;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_id", order_id)
    .single();

  if (error) {
    return res.status(404).json({
      error: "Order not found"
    });
  }

  res.json(data);
});

//updatin' orders

app.patch("/orders/:order_id", async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq("order_id", order_id)
    .select()
    .single();

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
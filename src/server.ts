import express from "express";
import { supabase } from "./supabase.js";
import type { OrderDetails } from "./types.js";
import { isOrderStatus } from "./types.js";
import { isOrderDetails } from "./types.js";
import { isUuid } from "./types.js";

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

  const body: unknown = req.body;

  if (!isOrderDetails(body)) {
    return res.status(400).json({
      error: "Invalid order data"
    });
  }
  const orderDetails:OrderDetails = body;

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: orderDetails.customerName,
        product_name: orderDetails.productName,
        quantity: orderDetails.quantity,
        total_amount: orderDetails.totalAmount
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
  const rawStatus = req.query.status;

  let query = supabase
    .from("orders")
    .select("*");

  if (rawStatus !== undefined) {
    if (typeof rawStatus !== "string" || !isOrderStatus(rawStatus)) {
      return res.status(400).json({
        error: "Invalid order status"
      });
    }

    query = query.eq("status", rawStatus);
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

   if (!isUuid(order_id)) {
    return res.status(400).json({
      error: "Invalid order ID"
    });
  }

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

   if (!isUuid(order_id)) {
    return res.status(400).json({
      error: "Invalid order ID"
    });
  }

  const status: unknown = req.body.status;

  if (!isOrderStatus(status)) {
    return res.status(400).json({
      error: "Invalid order status"
    });
  }

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
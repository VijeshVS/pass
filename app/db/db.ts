"use server";
import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGO_DB_URI || "";
let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_DB_URI);
    isConnected = true;
    console.log("Mongodb connected !!");
  } catch (e) {
    console.error("Mongodb connection error !!", e);
  }
}
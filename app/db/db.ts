'use server'
import mongoose from 'mongoose'

const MONGO_DB_URI = process.env.MONGO_DB_URI || ""
let isConnected = false

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String
})

const PaymentSchema = new mongoose.Schema({
  _id: { type: String },
  orderId: { type: String, required: true },
  signature: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  amount: { type: Number, required: true },
  passId: { type: String, required: true },
  noOfParticipants: { type: Number, default: 1 },
  participantsName: { type: [String], default: [] },
  participantsStatus: { type: [Boolean], default: [] },
  basePrice: { type: Number },
  gstAmount: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

export async function connectDB(){
    if(isConnected) return;

    try {
        await mongoose.connect(MONGO_DB_URI)    
        isConnected = true
        console.log("Mongodb connected !!")
    }
    catch(e) {
        console.error("Mongodb connection error !!",e);
    }
}

export const Payment = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
export const User = mongoose.models.User || mongoose.model('User', userSchema);
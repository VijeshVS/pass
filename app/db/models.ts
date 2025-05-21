"use server";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const participantSchema = new mongoose.Schema(
  {
    name: String,
    arrived: { type: Boolean, default: false },
  },
  { timestamps: false }
);


const registrationSchema = new mongoose.Schema(
  {
    _id: String,
    orderId: String,
    signature: String,
    name: String,
    email: String,
    phone: String,
    amount: Number,
    type: {
      type: String,
      enum: ["pass", "event"],
      required: true,
    },
    classId: String,
    noOfParticipants: {
      type: Number,
      default: 1,
    },
    participantsData: [participantSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "registrations",
    timestamps: true,
  }
);

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: false }
);

const EventSchema = new mongoose.Schema(
  {
    _id: String,
    photoPath: String,
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    date: String,
    time: String,
    venue: String,
    category: {
      type: String,
      enum: ["Cultural", "Technical", "Innovative", "Gaming"],
    },
    prizes: [String],
    teamsize: String,
    registrationFee: {
      type: Number,
      default: 0,
    },
    feetype: {
      type: String,
      enum: ["individuals", "team"],
      default: "individuals",
    },
    guidelines: [String],
    contact: [contactSchema],
    registrationDeadline: String,
    registrationOpen: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "event",
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const EventModel =
  mongoose.models.Event || mongoose.model("Event", EventSchema);
export const Registration =
  mongoose.models.Registration ||
  mongoose.model("Registration", registrationSchema);

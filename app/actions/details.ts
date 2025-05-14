"use server";

import {  Registration } from "../db/models";
import { connectDB } from "../db/db";
import { checkIfAuthenticated } from "./auth";

export async function getPassDetails(pass_id: string, token: string) {
  await connectDB();
  const check = await checkIfAuthenticated(token);

  if (!check) {
    return {
      status: 401,
    };
  }

  const passDoc = await Registration.findOne({ _id: pass_id });

  if (!passDoc) {
    return {
      status: 404,
    };
  }

  const pass = passDoc.toObject();

  if (Array.isArray(pass.participantsData)) {
    pass.participantsData = pass.participantsData.map((participant: any) => ({
      ...participant,
      _id: participant._id?.toString?.() || undefined,
    }));
  }

  pass._id = pass._id?.toString?.();

  return {
    status: 200,
    pass,
  };
}

export async function changeStatus(
  pass_id: string,
  token: string,
  participant_index: number
) {
  await connectDB();
  const check = await checkIfAuthenticated(token);

  if (!check) {
    return {
      status: 401,
    };
  }

  try {
    const payment = await Registration.findOne({ _id: pass_id });

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (
      participant_index < 0 ||
      participant_index >= payment.participantsData.length
    ) {
      throw new Error("Invalid participant index");
    }

    payment.participantsData[participant_index].arrived = true;

    await payment.save();

    return {
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
    };
  }
}

"use server";

import { Registration } from "../db/models";
import { connectDB } from "../db/db";
import { getRole } from "./auth";
import { mailto, resendMailto } from "./email";
import { checkIfAllowed } from "./role";

export async function getAllPasses(token: string) {
  await connectDB();

  const role = await getRole(token);

  if (!checkIfAllowed("view", role)) {
    return {
      status: 401,
      error: "Unauthorized",
    };
  }

  const passDocs = await Registration.find({});

  const passes = passDocs.map((doc) => {
    const pass = doc.toObject();

    if (Array.isArray(pass.participantsData)) {
      pass.participantsData = pass.participantsData.map((participant: any) => ({
        ...participant,
        _id: participant._id?.toString?.() || undefined,
      }));
    }

    pass._id = pass._id?.toString?.();
    return pass;
  });

  return {
    status: 200,
    passes,
  };
}

export async function getPassDetails(pass_id: string, token: string) {
  await connectDB();

  const role = await getRole(token);

  if (!checkIfAllowed("qr", role)) {
    return {
      status: 401,
      error: "Unauthorized",
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

  const role = await getRole(token);

  if (!checkIfAllowed("qr", role)) {
    return {
      status: 401,
      error: "Unauthorized",
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

function generateRandomString(length = 12) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function offlineRegister({
  name,
  email,
  phone,
  amount,
  classId,
  noOfParticipants = 1,
  participantsData = [],
  token,
}: {
  name: string;
  email: string;
  phone: string;
  amount: number;
  classId: string;
  noOfParticipants?: number;
  participantsData?: { name: string }[];
  token: string;
}) {
  await connectDB();
  const role = await getRole(token);

  if (!checkIfAllowed("offline_reg", role)) {
    return {
      status: 401,
      error: "Unauthorized",
    };
  }

  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 1000);
  const _id = `8THMILE_${timestamp}_${randomSuffix}`;
  const orderId = `cash_8THMILE_${timestamp}_${randomSuffix}`;
  const signature = generateRandomString(16); // 16-char random string

  const registration = new Registration({
    _id,
    orderId,
    signature,
    name,
    email,
    phone,
    amount,
    type: "event",
    classId,
    noOfParticipants,
    participantsData,
  });

  try {
    const reg = await registration.save();
    await mailto("event", reg, reg._id);
    return { success: true };
  } catch (err: any) {
    return { success: false };
  }
}

export async function sendResendMailForPass(token:string,type: string, registration: any, paymentId: string){

  const role = await getRole(token);

  if (!checkIfAllowed("resend_mail", role)) {
    return new Promise((resolve,reject)=>{
      reject("Unauthorized !!")
    })
  }

  await resendMailto(type, registration, paymentId);
}

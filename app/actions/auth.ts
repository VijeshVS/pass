"use server";

import { User } from "../db/models";
import { connectDB } from "../db/db";
import jwt, { JwtPayload } from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY || "hello"

export async function checkIfAuthenticated(token: string) {
  try {
    jwt.verify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function getRole(token: string){

  if(!checkIfAuthenticated(token)) return "none";

  const data = jwt.decode(token) as JwtPayload;
  const user = data.username;

  const userFromDB = await User.findOne({
    username: user,
  });

  if(!userFromDB) return "none"

  return userFromDB.role;
}

export async function login(username: string, password: string) {
  await connectDB();

  const user = await User.findOne({
    username,
    password,
  });

  if (!user) {
    return {
      status: 401,
      token: "",
    };
  }

  const token = jwt.sign(
    {
      username,
      role: user.role
    },
    secretKey
  );

  return {
    status: 200,
    token,
  };
}

export async function register(
  username: string,
  password: string,
  role: string
) {
  await connectDB();

  try {
    await User.create({
      username,
      password,
      role,
    });
  } catch (e) {
    console.log(e);
    return 500;
  }

  return 201;
}

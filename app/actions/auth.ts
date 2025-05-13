'use server'

import { connectDB, User } from "../db/db"
import jwt from 'jsonwebtoken'

const secretKey = "hello"

export async function checkIfAuthenticated(token:string){
    try {
        jwt.verify(token,secretKey);
        return true
    }
    catch {
        return false
    }   
}

export async function login(username:string,password:string){
    await connectDB();

    const user = await User.findOne({
        username,
        password
    })

    console.log(user)

    if(!user) {
        return {
            status: 401,
            token: ""
        }
    }

    const token = jwt.sign({
        username
    },secretKey)

    return {
        status: 200,
        token
    }
}   

export async function register(username:string,password:string,role:string){
    await connectDB();

    try {
        await User.create({
            username,
            password,
            role
        })  
    }
    catch(e){
        return 500
    }
    
    return 201;
}
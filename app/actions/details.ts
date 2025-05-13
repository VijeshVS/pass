'use server'

import { connectDB, Payment } from "../db/db";
import { checkIfAuthenticated } from "./auth";

// i have to check if the guy has access

export async function getPassDetails(pass_id: string, token: string) {
    await connectDB();
    const check = await checkIfAuthenticated(token);

    if(!check) {
        return {
            status: 401
        }
    }

    const pass = await Payment.findOne({
        _id: pass_id
    })

    // invalid pass
    if(!pass) {
        return {
            status: 404
        }
    }

    return {
        status:200,
        pass: pass.toObject()
    }
}

export async function changeStatus(pass_id: string, token: string, participant_index: number) {
    await connectDB();
    const check = await checkIfAuthenticated(token);

    if(!check) {
        return {
            status: 401
        }
    }

    try {
        const payment = await Payment.findOne({ _id: pass_id });
        
        if (!payment) {
            throw new Error('Payment not found');
        }

        if (participant_index < 0 || participant_index >= payment.participantsStatus.length) {
            throw new Error('Invalid participant index');
        }

        payment.participantsStatus[participant_index] = true;

        await payment.save();

        return {
            status: 200
        }
    } catch (error) {
        console.log(error)
        return {
            status: 500
        }
    }
}
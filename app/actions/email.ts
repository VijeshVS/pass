'use server'

import { sendEmail } from "../utils/server-utils";

// This email is for offline registration
export async function mailto(type: string, registration: any, paymentId: string) {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify?payment_id=${paymentId}`;
    let emailHtml, subject, plainText;

    if (type === "pass") {
        subject = `Offline Registration Received: ${paymentId}`;
        plainText = `Hello ${registration.name},\n\nWe have received your offline registration for ${registration.classId}. Please visit the venue to complete the payment and confirm your participation.`;

        emailHtml = `
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c2c2c; padding: 24px;">
            <h1 style="color: #5a3e2b; font-size: 28px; margin-bottom: 16px;">Offline Registration Confirmation</h1>
            <p style="font-size: 16px; margin-bottom: 12px;">Dear <strong style="color: #3c2f1c;">${registration.name}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
                We have successfully received your offline registration for 
                <strong style="color: #5a3e2b;">${registration.classId}</strong>.
            </p>
            <ul style="list-style: none; padding: 0; font-size: 15px; margin-bottom: 20px;">
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Name:</strong> ${registration.name}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Email:</strong> ${registration.email}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Phone:</strong> ${registration.phone || "Not provided"}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Reference ID:</strong> ${paymentId}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Order ID:</strong> ${registration.orderId}</li>
            </ul>
            <p style="font-size: 16px; margin-bottom: 24px;">
                Please visit the event venue to complete the payment and confirm your participation.
            </p>
            <p style="font-size: 16px;">You may confirm your registration or review details using the button below:</p>
            <div style="margin-top: 16px;">
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #5a3e2b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    Review Registration
                </a>
            </div>
            <p style="font-size: 14px; color: #777777; margin-top: 32px;">
                If you have any questions or need support, feel free to reply to this email.
            </p>
        </div>`;
    } else if (type === "event") {
        subject = `Offline Registration Received: ${paymentId}`;
        plainText = `Hello ${registration.name},\n\nYour offline registration for ${registration.classId} has been received. Please visit the venue to complete the payment and confirm your participation.`;

        emailHtml = `
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c2c2c; padding: 24px;">
            <h1 style="color: #5a3e2b; font-size: 28px; margin-bottom: 16px;">Offline Registration Confirmation</h1>
            <p style="font-size: 16px; margin-bottom: 12px;">Dear <strong style="color: #3c2f1c;">${registration.name}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
                Your offline registration for 
                <strong style="color: #5a3e2b;">${registration.classId}</strong> has been received.
            </p>
            <ul style="list-style: none; padding: 0; font-size: 15px; margin-bottom: 20px;">
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Name:</strong> ${registration.name}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Email:</strong> ${registration.email}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Phone:</strong> ${registration.phone || "Not provided"}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Reference ID:</strong> ${paymentId}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Order ID:</strong> ${registration.orderId}</li>
            </ul>
            <p style="font-size: 16px; margin-bottom: 12px;">
                <strong style="color: #4b3621;">Participants:</strong>
            </p>
            <ul style="list-style: none; padding: 0; font-size: 15px; margin-bottom: 20px;">
                ${registration.participantsData.map(
                    (memberName: any) => `<li style="margin-bottom: 8px;">${memberName.name}</li>`
                ).join("")}
            </ul>
            <p style="font-size: 16px;">You may review your registration using the button below:</p>
            <div style="margin-top: 16px;">
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #5a3e2b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    Review Registration
                </a>
            </div>
            <p style="font-size: 14px; color: #777777; margin-top: 32px;">
                If you have any questions or need support, feel free to reply to this email.
            </p>
        </div>`;
    }

    await sendEmail(registration.email, String(subject), String(plainText), String(emailHtml));
}


// This email is resend beacause previous email might be lost
export async function resendMailto(type: string, registration: any, paymentId: string) {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify?payment_id=${paymentId}`;
    let emailHtml, subject, plainText;

    subject = `Registration Confirmation: ${paymentId}`;
    plainText = `Hello ${registration.name},\n\nWe have received your registration for ${registration.classId}.\nYou can view the registration details here: ${url}`;

    if (type === "pass") {
        emailHtml = `
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c2c2c; padding: 24px;">
            <h1 style="color: #5a3e2b; font-size: 28px; margin-bottom: 16px;">Registration Confirmation</h1>
            <p style="font-size: 16px; margin-bottom: 12px;">Dear <strong style="color: #3c2f1c;">${registration.name}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
                We have received your registration for 
                <strong style="color: #5a3e2b;">${registration.classId}</strong>.
            </p>
            <ul style="list-style: none; padding: 0; font-size: 15px; margin-bottom: 20px;">
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Name:</strong> ${registration.name}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Email:</strong> ${registration.email}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Phone:</strong> ${registration.phone || "Not provided"}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Reference ID:</strong> ${paymentId}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Order ID:</strong> ${registration.orderId}</li>
            </ul>
            <p style="font-size: 16px;">You can view your registration using the button below:</p>
            <div style="margin-top: 16px;">
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #5a3e2b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    View Registration
                </a>
            </div>
            <p style="font-size: 14px; color: #777777; margin-top: 32px;">
                If you have any questions or need support, feel free to reply to this email.
            </p>
        </div>`;
    } else if (type === "event") {
        emailHtml = `
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #2c2c2c; padding: 24px;">
            <h1 style="color: #5a3e2b; font-size: 28px; margin-bottom: 16px;">Registration Confirmation</h1>
            <p style="font-size: 16px; margin-bottom: 12px;">Dear <strong style="color: #3c2f1c;">${registration.name}</strong>,</p>
            <p style="font-size: 16px; margin-bottom: 20px;">
                We have received your registration for 
                <strong style="color: #5a3e2b;">${registration.classId}</strong>.
            </p>
            <ul style="list-style: none; padding: 0; font-size: 15px; margin-bottom: 20px;">
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Name:</strong> ${registration.name}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Email:</strong> ${registration.email}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Phone:</strong> ${registration.phone || "Not provided"}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Reference ID:</strong> ${paymentId}</li>
                <li style="margin-bottom: 8px;"><strong style="color: #4b3621;">Order ID:</strong> ${registration.orderId}</li>
            </ul>
            <p style="font-size: 16px; margin-bottom: 12px;">
                <strong style="color: #4b3621;">Participants:</strong>
            </p>
            <ul style="list-style: none; padding: 0; font-size: 15px; margin-bottom: 20px;">
                ${registration.participantsData.map(
                    (memberName: any) => `<li style="margin-bottom: 8px;">${memberName.name}</li>`
                ).join("")}
            </ul>
            <p style="font-size: 16px;">You can view your registration using the button below:</p>
            <div style="margin-top: 16px;">
                <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #5a3e2b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px;">
                    View Registration
                </a>
            </div>
            <p style="font-size: 14px; color: #777777; margin-top: 32px;">
                If you have any questions or need support, feel free to reply to this email.
            </p>
        </div>`;
    }
    else {
        emailHtml = ``
    }

    await sendEmail(registration.email, subject, plainText, emailHtml);
}

'use server';

import { StaffDto } from "@/lib/api/types";
import { Resend } from "resend";
import { getEmailHtml } from "./EmailMessage";

export async function EmailComposer(data: StaffDto) {

    const apiKey = process.env.ECHONAV_EMAIL_API_KEY;
    if (!apiKey) {
        console.error("CRITICAL CONFIGURATION ERROR: ECHONAV_EMAIL_API_KEY is not defined in your environment variables.");
        return { success: false, error: "Email service provider configuration is missing." };
    }

    const resend = new Resend(apiKey);
    // Build the registration link dynamically using the invite token string from the state request
    const registrationUrl = `http://localhost:3000/landing`;
    try {
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: "EchoNav <onboarding@resend.dev>",
            to: [data.email],
            subject: "You're invited to join EchoNav!",
            html: getEmailHtml({
                role: data.role.toUpperCase(), // Normalize casing to stay clean
                inviteLink: registrationUrl
            })
        });

        if (emailError) {
            console.error("Resend API Failure Error:", emailError);
            return { success: false, error: emailError.message || JSON.stringify(emailError) };
        }
        return { success: true, data: emailData };
    } catch (catchErr: unknown) {
        console.error("Unhandled Exception caught inside EmailComposer:", catchErr);
        return {
            success: false,
            error: catchErr instanceof Error ? catchErr.message : "An unexpected server execution crash occurred."

        };
    }
}
/*
'use server';

import { InviteStaffRequest } from "@/lib/api/types";
import { google } from "googleapis";
import { getEmailHtml } from "./EmailMessage";

export async function EmailComposer(data: InviteStaffRequest) {
    // 1. Collect required OAuth properties from your local environment configuration
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const senderEmail = process.env.GOOGLE_SENDER_EMAIL; // e.g., tracking@yourdomain.com

    if (!clientId || !clientSecret || !refreshToken || !senderEmail) {
        console.error("CRITICAL CONFIGURATION ERROR: Missing Google API Environment Configuration.");
        return { success: false, error: "Email provider configuration keys are incomplete." };
    }

    // 2. Instantiate and authorize the Google OAuth2 Client
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });

    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    // 3. Build registration URL string matching your onboarding flow
    const targetInviteToken = data.inviteCode || "";
    const registrationUrl = `http://localhost:3000/auth?tab=login&code=${targetInviteToken}&email=${encodeURIComponent(data.email)}`;

    // 4. Construct raw MIME structure matching RFC 2822
    const emailHtmlBody = getEmailHtml({ 
        role: data.role.toUpperCase(), 
        inviteLink: registrationUrl 
    });

    const utf8Subject = `=?utf-8?B?${Buffer.from("You're invited to join EchoNav!").toString("base64")}?=`;
    
    const rawMimeParts = [
        `From: EchoNav <${senderEmail}>`,
        `To: ${data.email}`,
        `Subject: ${utf8Subject}`,
        "MIME-Version: 1.0",
        'Content-Type: text/html; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "",
        Buffer.from(emailHtmlBody).toString("base64")
    ];

    const rawMimeMessage = rawMimeParts.join("\r\n");

    // 5. Convert string message payload to safe base64url compliance encoding
    const encodedRawMessage = Buffer.from(rawMimeMessage)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    try {
        // 6. Push raw message out to Google API transmission layers
        const response = await gmail.users.messages.send({
            userId: "me",
            requestBody: {
                raw: encodedRawMessage,
            },
        });

        return { success: true, data: response.data };
    } catch (catchErr: unknown) {
        console.error("Unhandled Exception caught inside Google EmailComposer:", catchErr);
        return { 
            success: false, 
            error: catchErr instanceof Error ? catchErr.message : "An unexpected Google API error occurred." 
        };
    }
}
*/



export function getEmailHtml({ role, inviteLink }: { role: string; inviteLink: string }) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitation to Join EchoNav</title>
      </head>
      <body style="margin: 0; padding: 40px 20px; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        
        <!-- The Card Body (w-full max-w-md mx-auto shadow-md border rounded-lg) -->
        <div style="max-width: 448px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); overflow: hidden;">
          
          <!-- CardHeader -->
          <div style="padding: 24px 24px 16px 24px; border-bottom: 1px solid #f4f4f5;">
            <h1 style="margin: 0; font-size: 14px; font-weight: 600; color: #09090b; line-height: 1;">
              Invitation to Join EchoNav
            </h1>
          </div>
          
          <!-- CardContent -->
          <div style="padding: 24px 24px 16px 24px;">
            <div style="font-size: 14px; font-weight: 500; color: #09090b; margin-bottom: 8px;">
              You have been invited to join EchoNav as a ${role}
            </div>
            <p style="margin: 0; font-size: 14px; color: #71717a; line-height: 1.5;">
              Please click the link below to accept the invitation and set up your account.
            </p>
          </div>
          
          <!-- CardFooter + Button -->
          <div style="padding: 0 24px 24px 24px;">
            <a href="${inviteLink}" style="display: block; width: 100%; box-sizing: border-box; background-color: #18181b; color: #ffffff; text-align: center; padding: 10px 0; font-size: 14px; font-weight: 500; text-decoration: none; border-radius: 6px;">
              Accept Invitation
            </a>
          </div>

        </div>
        
      </body>
    </html>
  `;
}
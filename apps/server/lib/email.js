const { Resend } = require("resend");

// Lazily create the client so the server can boot without a key in dev
// (emails just no-op + log the link to the console instead).
let resend = null;
function client() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM = process.env.RESEND_FROM || "onboarding@resend.dev";

async function sendVerificationEmail(to, link) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #6d28d9;">Welcome to Gaming 🎰</h2>
      <p>Confirm your email to activate your account and claim your starting balance.</p>
      <p style="margin: 28px 0;">
        <a href="${link}"
           style="background:#6d28d9;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
          Verify my account
        </a>
      </p>
      <p style="color:#666;font-size:13px;">This link expires in 24 hours. If you didn't sign up, ignore this email.</p>
      <p style="color:#999;font-size:12px;">${link}</p>
    </div>`;

  const c = client();
  if (!c) {
    // Dev fallback: no key configured → surface the link in server logs.
    console.log(`[email] verification link for ${to}: ${link}`);
    return { id: "dev-noop" };
  }

  const { data, error } = await c.emails.send({
    from: FROM,
    to,
    subject: "Verify your Gaming account",
    html,
  });
  if (error) throw new Error(error.message || "Failed to send email");
  return data;
}

module.exports = { sendVerificationEmail };

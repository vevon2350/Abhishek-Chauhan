import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Safe public config keys for frontend client
  app.get("/api/config", (req: express.Request, res: express.Response) => {
    res.json({
      razorpayKeyId: process.env.RAZORPAY_KEY_ID || "rzp_test_Sv3QjSbb3511sd"
    });
  });

  // API Route: Send secure SMS OTP via Twilio
  app.post("/api/send-otp", async (req: express.Request, res: express.Response) => {
    try {
      const { phone, otp, name } = req.body;
      if (!phone || !otp) {
        return res.status(400).json({ error: "Phone and OTP are required" });
      }

      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

      // Check if credentials are missing
      if (!accountSid || !authToken || !twilioPhone) {
        return res.status(200).json({
          success: false,
          demoMode: true,
          error: "Simulation mode active",
          message: "Secure login OTP generated successfully! Testing help ke liye verification code upar screen notification screen par instant dikhaya gya hai.",
          otp: otp
        });
      }

      // Format recipient phone to international format (+91 for India as default if missing)
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith("+")) {
        // Default to India (+91)
        formattedPhone = `+91${formattedPhone}`;
      }

      // Format clean SMS body with Pragya Electric branding
      const smsBody = `Pragya Electric secure verification OTP is ${otp}. Yeh code aapka login secure karne ke liye hai. Nominate 2026.`;

      const params = new URLSearchParams();
      params.append("To", formattedPhone);
      params.append("From", twilioPhone);
      params.append("Body", smsBody);

      const authString = `${accountSid}:${authToken}`;
      const authHeader = "Basic " + Buffer.from(authString).toString("base64");

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Twilio Gateway Error:", responseData);
        return res.status(200).json({
          success: false,
          demoMode: true,
          error: "Twilio API Failure",
          message: responseData.message || "Twilio request failed.",
          otp: otp
        });
      }

      return res.status(200).json({
        success: true,
        demoMode: false,
        message: "Real SMS successfully sent!"
      });

    } catch (err: any) {
      console.error("Twilio internal API integration error:", err);
      // Fallback response inside sandbox preview environments
      return res.status(200).json({
        success: false,
        demoMode: true,
        error: "Server Error",
        message: err.message || "Something went wrong server side.",
        otp: req.body.otp
      });
    }
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server connected successfully on host 0.0.0.0, running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal: failed to boot Pragya Full-Stack Server:", err);
});

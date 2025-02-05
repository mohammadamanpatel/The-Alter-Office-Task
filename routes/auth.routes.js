import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { config } from "dotenv";
config();
const router = express.Router();

// Step 1: Redirect the user to Google's OAuth2 URL
router.get("/google", (req, res) => {
  const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.CALL_BACK_URL}&response_type=code&scope=email profile`;
  console.log("googleAuthURL", googleAuthURL);
  return res.json(googleAuthURL);
});

// Step 2: Handle the Google callback and exchange the code for an access token
router.get("/google/callback", async (req, res) => {
  console.log("req.query", req.query);
  const code = req.query.code; // Authorization code from Google
  try {
    // Step 3: Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.CALL_BACK_URL,
        grant_type: "authorization_code",
        code: code,
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // Step 4: Use the access token to get the user's profile information
    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const { id: googleId, name: displayName, email, picture: avatar } = userInfoResponse.data;

    // Step 5: Check if user exists in the database
    let user = await User.findOne({ googleId });
    if (!user) {
      // Create a new user if not found
      user = new User({ googleId, displayName, email, avatar });
      await user.save();
    } else {
      // Optionally update user info (if needed)
      user.displayName = displayName;
      user.avatar = avatar;
      await user.save();
    }

    // Step 6: Generate a JWT
    const token = jwt.sign(
      {
        id: user._id,
        googleId: user.googleId,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    user.token = token;

    // Step 7: Set the JWT in cookies or return it to frontend
    const cookieOption = {
      MaxAge: process.env.COOKIE_MAX_AGE,
      httpOnly: true,
      secure: true, // Set to true if using https
    };
    res.cookie("token", token, cookieOption);

    // Step 8: Send response to frontend with user info and token
    res.redirect(`${process.env.FRONTEND_URL}/dashboard?token=${token}&userId=${user._id}`);
  } catch (error) {
    console.error("Error during Google OAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import supabase from "../config/supabase.js";
import logActivity from "../utils/activityLogger.js";
import transporter from "../config/nodemailer.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check whether email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUserError) {
      throw existingUserError;
    }

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password: hashedPassword,
      })
      .select("id, name, email, is_admin")
      .single();

    if (error) {
      throw error;
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Log signup activity
    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "SIGNUP",
      targetType: "USER",
      targetId: String(user.id),
      details: {
        email: user.email,
      },
    });

    // Send welcome email
    try {
      await transporter.sendMail({
        from: `"GameStore" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Welcome to GameStore!",
        text: `Hi ${user.name},

Welcome to GameStore! Your account has been created successfully.

We're glad to have you with us!

GameStore`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h1>Welcome to GameStore! 🎮</h1>

            <p>Hi ${user.name},</p>

            <p>
              Your account has been created successfully.
              We're glad to have you with us!
            </p>

            <p>
              Happy shopping!
            </p>

            <p>
              <strong>GameStore Team</strong>
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      // Don't fail account creation if the email fails
      console.error("Welcome email failed:", emailError);
    }

    res.status(201).json({
      message: "Account created",
      user,
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password with stored hash
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // Log login
    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "LOGIN",
      targetType: "USER",
      targetId: String(user.id),
      details: {
        email: user.email,
      },
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, is_admin")
      .eq("id", req.user.userId)
      .single();

    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", req.user.userId)
      .maybeSingle();

    if (existingUserError) {
      throw existingUserError;
    }

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already in use",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .update({
        name,
        email,
      })
      .eq("id", req.user.userId)
      .select("id, name, email, is_admin")
      .single();

    if (error) {
      throw error;
    }

    // Log profile update
    await logActivity({
      userId: user.id,
      userName: user.name,
      action: "UPDATE_PROFILE",
      targetType: "USER",
      targetId: String(user.id),
      details: {
        name,
        email,
      },
    });

    res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update profile",
    });
  }
};

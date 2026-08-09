import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Name, email and password are required",
      });
      return;
    }

    const user = await registerUser(
      name,
      email,
      password,
      role
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message:
        error instanceof Error ? error.message : "Registration failed",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      message:
        error instanceof Error ? error.message : "Invalid email or password",
    });
  }
};

export const profile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
};
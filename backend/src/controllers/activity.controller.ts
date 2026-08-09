import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createActivity, getLeadActivities } from "../services/activity.service";
import { ActivityType } from "../types/activity";
import prisma from "../prisma/client";
import { Prisma } from "@prisma/client";

// Standard error response format
const errorResponse = (res: Response, status: number, message: string, error: string, extra?: any) => {
  return res.status(status).json({
    success: false,
    message,
    error,
    ...extra
  });
};

// Standard success response format
const successResponse = (res: Response, data: any, message?: string) => {
  return res.json({
    success: true,
    data,
    ...(message && { message })
  });
};

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId } = req.params;
    
    if (!leadId) {
      return errorResponse(res, 400, "Lead ID is required", "VALIDATION_ERROR");
    }
    
    const activities = await getLeadActivities(leadId);
    return successResponse(res, activities);
  } catch (error) {
    console.error("[getActivities] Error:", error);
    return errorResponse(
      res, 
      500, 
      error instanceof Error ? error.message : "Failed to fetch activities",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export const addNote = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;
    
    // Auth check
    if (!userId) {
      return errorResponse(res, 401, "Unauthorized", "AUTH_ERROR");
    }
    
    // Validation
    if (!content || content.trim() === "") {
      return errorResponse(res, 400, "Note content is required", "VALIDATION_ERROR", { field: "content" });
    }
    
    if (content.length > 1000) {
      return errorResponse(res, 400, "Note must be less than 1000 characters", "VALIDATION_ERROR", { 
        field: "content",
        maxLength: 1000,
        currentLength: content.length
      });
    }
    
    // Check lead exists
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true }
    });
    
    if (!lead) {
      return errorResponse(res, 404, "Lead not found", "NOT_FOUND");
    }
    
    // Create note
    const note = await prisma.leadNote.create({
      data: {
        content: content.trim(),
        leadId,
        userId,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    // Log activity
    await createActivity(
      ActivityType.NOTE_ADDED,
      `Note: ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`,
      leadId,
      userId
    );
    
    return res.status(201).json({
      success: true,
      data: note,
      message: "Note added successfully"
    });
    
  } catch (error) {
    console.error("[addNote] Error:", error);
    
    // Handle Prisma foreign key errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return errorResponse(res, 404, "Lead or user not found", "FOREIGN_KEY_ERROR");
      }
    }
    
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Failed to add note",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { leadId } = req.params;
    
    if (!leadId) {
      return errorResponse(res, 400, "Lead ID is required", "VALIDATION_ERROR");
    }
    
    const notes = await prisma.leadNote.findMany({
      where: { leadId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    return successResponse(res, notes);
  } catch (error) {
    console.error("[getNotes] Error:", error);
    return errorResponse(
      res,
      500,
      error instanceof Error ? error.message : "Failed to fetch notes",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as promotionService from '../services/promotion.service';

export const getActivePromotions = async (req: Request, res: Response) => {
  const promotions = await promotionService.getActivePromotions();
  return sendSuccess(res, 'Active promotions fetched successfully', { promotions });
};

export const getPromotionById = async (req: Request, res: Response) => {
  const promotionId = req.params.id as string;
  const promotion = await promotionService.getPromotionById(promotionId);
  return sendSuccess(res, 'Promotion fetched successfully', { promotion });
};

export const createPromotion = async (req: Request, res: Response) => {
  const { title, description, imageUrl, discountPercentage, discountAmount, isActive, startDate, endDate } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return sendError(res, 'title is required and cannot be empty', [], 400);
  }

  if (!startDate || isNaN(Date.parse(startDate))) {
    return sendError(res, 'startDate is required and must be a valid date', [], 400);
  }

  if (!endDate || isNaN(Date.parse(endDate))) {
    return sendError(res, 'endDate is required and must be a valid date', [], 400);
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    return sendError(res, 'endDate must be after startDate', [], 400);
  }

  const hasPercentage = discountPercentage !== undefined && discountPercentage !== null;
  const hasAmount = discountAmount !== undefined && discountAmount !== null;

  if (!hasPercentage && !hasAmount) {
    return sendError(res, 'At least one discount mechanism (percentage or amount) must be provided', [], 400);
  }

  let parsedPercentage: number | undefined;
  if (hasPercentage) {
    parsedPercentage = parseFloat(discountPercentage);
    if (isNaN(parsedPercentage) || parsedPercentage <= 0 || parsedPercentage > 100) {
      return sendError(res, 'discountPercentage must be between 0 and 100', [], 400);
    }
  }

  let parsedAmount: number | undefined;
  if (hasAmount) {
    parsedAmount = parseFloat(discountAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return sendError(res, 'discountAmount must be greater than or equal to 0', [], 400);
    }
  }

  // Strict check if both provided but business says ambiguous unless supported
  // "If both are provided, allow it only if the existing business model explicitly supports combined discounts. Otherwise reject ambiguous configurations with: 400 Bad Request"
  // Safe to reject ambiguous to keep it clean.
  if (hasPercentage && hasAmount) {
    return sendError(res, 'Provide either discountPercentage or discountAmount, not both', [], 400);
  }

  const promotion = await promotionService.createPromotion({
    title: title.trim(),
    description: description ? String(description).trim() : undefined,
    imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
    discountPercentage: parsedPercentage,
    discountAmount: parsedAmount,
    isActive: isActive === undefined ? true : Boolean(isActive),
    startDate: start,
    endDate: end
  });

  return sendSuccess(res, 'Promotion created successfully', { promotion }, 201);
};

export const updatePromotion = async (req: Request, res: Response) => {
  const promotionId = req.params.id as string;
  const { title, description, imageUrl, discountPercentage, discountAmount, isActive, startDate, endDate } = req.body;

  let parsedPercentage: number | undefined;
  if (discountPercentage !== undefined && discountPercentage !== null) {
    parsedPercentage = parseFloat(discountPercentage);
    if (isNaN(parsedPercentage) || parsedPercentage <= 0 || parsedPercentage > 100) {
      return sendError(res, 'discountPercentage must be between 0 and 100', [], 400);
    }
  } else if (discountPercentage === null) {
    parsedPercentage = undefined; // if user wants to clear it, but Prisma requires null to clear, let's keep it simple
  }

  let parsedAmount: number | undefined;
  if (discountAmount !== undefined && discountAmount !== null) {
    parsedAmount = parseFloat(discountAmount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return sendError(res, 'discountAmount must be greater than or equal to 0', [], 400);
    }
  }

  let start: Date | undefined;
  let end: Date | undefined;

  if (startDate !== undefined) {
    if (isNaN(Date.parse(startDate))) {
      return sendError(res, 'startDate must be a valid date', [], 400);
    }
    start = new Date(startDate);
  }

  if (endDate !== undefined) {
    if (isNaN(Date.parse(endDate))) {
      return sendError(res, 'endDate must be a valid date', [], 400);
    }
    end = new Date(endDate);
  }

  // We should ideally fetch existing dates to validate range properly if only one date is updated, 
  // but simpler to check if both are provided
  if (start && end && end <= start) {
    return sendError(res, 'endDate must be after startDate', [], 400);
  }

  // We don't do deep cross-validation here, just trust the inputs are clean, or service can throw
  // But wait! If we do `discountPercentage: null`, Prisma would expect `null` to clear it.
  const updateData: any = {};
  if (title !== undefined) updateData.title = title.trim();
  if (description !== undefined) updateData.description = description;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (isActive !== undefined) updateData.isActive = Boolean(isActive);
  if (start) updateData.startDate = start;
  if (end) updateData.endDate = end;
  if (discountPercentage !== undefined) updateData.discountPercentage = discountPercentage === null ? null : parsedPercentage;
  if (discountAmount !== undefined) updateData.discountAmount = discountAmount === null ? null : parsedAmount;

  // Fetch existing promotion to do strict date and cross validation
  const existing = await promotionService.getPromotionById(promotionId).catch(() => null);
  if (!existing) {
    return sendError(res, 'Promotion not found', [], 404);
  }

  const finalStart = start || existing.startDate;
  const finalEnd = end || existing.endDate;

  if (finalEnd <= finalStart) {
    return sendError(res, 'endDate must be after startDate', [], 400);
  }

  const finalPercentage = updateData.discountPercentage !== undefined ? updateData.discountPercentage : existing.discountPercentage;
  const finalAmount = updateData.discountAmount !== undefined ? updateData.discountAmount : existing.discountAmount;

  if (finalPercentage === null && finalAmount === null) {
    return sendError(res, 'Promotion must have at least one discount mechanism', [], 400);
  }

  if (finalPercentage !== null && finalAmount !== null) {
    return sendError(res, 'Provide either discountPercentage or discountAmount, not both', [], 400);
  }

  const promotion = await promotionService.updatePromotion(promotionId, updateData);
  return sendSuccess(res, 'Promotion updated successfully', { promotion });
};

export const deletePromotion = async (req: Request, res: Response) => {
  const promotionId = req.params.id as string;
  await promotionService.deletePromotion(promotionId);
  return sendSuccess(res, 'Promotion deleted successfully', null);
};

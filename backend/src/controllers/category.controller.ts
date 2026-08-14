import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';
import * as categoryService from '../services/category.service';

export const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  return sendSuccess(res, 'Categories fetched successfully', { categories });
};

export const getCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const category = await categoryService.getCategoryById(id);
  return sendSuccess(res, 'Category fetched successfully', { category });
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, description } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return sendError(res, 'Name is required and cannot be empty', [], 400);
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length > 100) {
    return sendError(res, 'Name exceeds maximum length of 100 characters', [], 400);
  }

  let trimmedDescription = description;
  if (description !== undefined) {
    if (typeof description !== 'string') {
      return sendError(res, 'Description must be a string', [], 400);
    }
    trimmedDescription = description.trim();
    if (trimmedDescription.length > 500) {
      return sendError(res, 'Description exceeds maximum length of 500 characters', [], 400);
    }
  }

  const category = await categoryService.createCategory({
    name: trimmedName,
    description: trimmedDescription
  });

  return sendSuccess(res, 'Category created successfully', { category }, 201);
};

export const updateCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { name, description } = req.body;

  const dataToUpdate: any = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return sendError(res, 'Name cannot be empty if provided', [], 400);
    }
    const trimmedName = name.trim();
    if (trimmedName.length > 100) {
      return sendError(res, 'Name exceeds maximum length of 100 characters', [], 400);
    }
    dataToUpdate.name = trimmedName;
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      return sendError(res, 'Description must be a string', [], 400);
    }
    const trimmedDescription = description.trim();
    if (trimmedDescription.length > 500) {
      return sendError(res, 'Description exceeds maximum length of 500 characters', [], 400);
    }
    dataToUpdate.description = trimmedDescription;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return sendError(res, 'No valid fields provided for update', [], 400);
  }

  const category = await categoryService.updateCategory(id, dataToUpdate);
  return sendSuccess(res, 'Category updated successfully', { category });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await categoryService.deleteCategory(id);
  return sendSuccess(res, 'Category deleted successfully', {}, 200);
};

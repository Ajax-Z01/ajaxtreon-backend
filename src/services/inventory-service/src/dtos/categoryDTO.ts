import { body, ValidationChain } from 'express-validator';

// DTO for creating a new category
const createCategoryDto: ValidationChain[] = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
];

// DTO for updating a category
const updateCategoryDto: ValidationChain[] = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string'),
];

export {
  createCategoryDto,
  updateCategoryDto,
};

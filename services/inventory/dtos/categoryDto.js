const { body } = require('express-validator');

// DTO for creating a new category
const createCategoryDto = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string'),
];

// DTO for updating a category
const updateCategoryDto = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string'),
];

module.exports = {
  createCategoryDto,
  updateCategoryDto,
};

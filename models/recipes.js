const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const joi = require("joi");
const recipesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      unique: true,
    },
    ingredients: {
      type: String,
      trim: true,
    },
    recipe: {
      type: String,
      trim: true,
    },
    prepTime: {
      type: Number,
      trim: true,
    },
    cookTime: {
      type: Number,
      trim: true,
    },
    image: {
      url: String,
      _id: String,
    },
  },
  { timestamps: true }
);
recipesSchema.plugin(mongoosePaginate);
const recipesModel = mongoose.model("recipe", recipesSchema);
const addRecipeValidation = joi.object({
  title: joi.string().required().max(20).messages({
    "string.base": `Title should be a type of string`,
    "string.max": "Title Must be at latest 20",
    "any.required": `Title is a required field`,
  }),
  image: joi.object().keys({
    url: joi.string().required().messages({
      "any.required": `Image is a required field`,
    }),
  }),
  recipe: joi.string().required().messages({
    "string.base": `Recipe should be a type of string`,
    "any.required": `Recipe is a required field`,
  }),
  ingredients: joi.string().required().messages({
    "string.base": `Ingredients should be a type of string`,
    "any.required": `Ingredients is a required field`,
  }),
  prepTime: joi.number().required().messages({
    "number.base": `PrepTime should be a type of number`,
    "any.required": `PrepTime is a required field`,
  }),
  cookTime: joi.number().required().messages({
    "number.base": `CookTime should be a type of number`,
    "any.required": `CookTime is a required field`,
  }),
});
const validateNewRecipe = (recipe) => {
  return addRecipeValidation.validate(recipe);
};
const upadteRecipeValidation = joi.object({
  title: joi.string().required().max(20).messages({
    "string.base": `Title should be a type of string`,
    "string.max": "Title Must be at latest 20",
    "any.required": `Title is a required field`,
  }),
  image: joi.string().optional(),
  imageId: joi.string(),
  recipe: joi.string().required().messages({
    "string.base": `Recipe should be a type of string`,
    "any.required": `Recipe is a required field`,
  }),
  ingredients: joi.string().required().messages({
    "string.base": `Ingredients should be a type of string`,
    "any.required": `Ingredients is a required field`,
  }),
  prepTime: joi.number().required().messages({
    "number.base": `PrepTime should be a type of number`,
    "any.required": `PrepTime is a required field`,
  }),
  cookTime: joi.number().required().messages({
    "number.base": `CookTime should be a type of number`,
    "any.required": `CookTime is a required field`,
  }),
});
const validateUpdateRecipe = (recipe) => {
  return upadteRecipeValidation.validate(recipe);
};
module.exports = { recipesModel, validateNewRecipe ,validateUpdateRecipe};

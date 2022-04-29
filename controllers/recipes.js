const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const AppError = require("../helpers/AppError");
const {
  recipesModel,
  validateNewRecipe,
  validateUpdateRecipe,
} = require("../models/recipes");

const storage = multer.diskStorage({
  limits: {
    fileSize: 1000000,
  },
  // destination: function (req, file, callback) {
  //   callback(null, "upload/recipesImage");
  // },
  filename: function (req, file, callback) {
    callback(
      null,
      "recipe" + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  fileFilter: async function (req, file, callback) {
    if (!file.originalname.match(/\.(png|jpg|PNG|gif|jpeg)$/)) {
      return callback(new AppError("OnlyImages"), false);
    }
    callback(null, true);
  },
}).single("image");

const addRecipe = async (req, res, next) => {
  // validation requst body by joi
  const { error } = await validateNewRecipe({
    ...req.body,
    image: { url: req.file?.path },
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }
  // check if recipe exist before upload image
  const titleExist = await recipesModel.findOne({ title: req.body.title });
  if (titleExist) {
    return next(new AppError("recipeIsExist"));
  }
  // use cloudinary to upload images
  const result = await cloudinary.uploader.upload(req.file.path);

  // add new Recipe
  const newRecipe = await recipesModel.create({
    ...req.body,
    image: { url: result.secure_url, _id: result.public_id },
  });

  res.status(201).json({_id:newRecipe._id});
};

const getRecipes = async (req, res, next) => {
  let { page = 1 } = req.query;
  const options = {
    page: page,
    limit: 1,
  };
  const recipes = await recipesModel.paginate({}, options);
  res.json(recipes);
};
const getSpecificRecipe = async (req, res, next) => {
  const { id } = req.params;
  const result = await recipesModel.findById(id);
  if (!result) {
    return next(new AppError("recipeIsNotExist"));
  }
  res.json(result);
};
const updateRecipe = async (req, res, next) => {
  // validation requst body by joi
  const { error } = await validateUpdateRecipe(req.body);
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    //delete old image and upload new image if want to update image
    if (req?.file?.path) {
      let deleteImage = await cloudinary.uploader.destroy(req.body.imageId);
      const result = await cloudinary.uploader.upload(req?.file?.path);
      req.body.image = { url: result.secure_url, _id: result.public_id };
    }

    //update recipe
    const recipe = await recipesModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    res.json(recipe);
  } catch (error) {
    res.status(500).json();
  }
};

const deleteRecipe = async (req, res, next) => {
  const { id } = req.params;
  const result = await recipesModel.findByIdAndDelete(id);
  await cloudinary.uploader.destroy(result.image._id);
  if (!result) {
    return next(new AppError("recipeIsNotExist"));
  }
  res.json();
};

const clearRecipes = async (req,res,next) =>{
  try {
    // get all images id to deleted from cloudinary
    let ids = await recipesModel.find({},{'image._id':1,_id:0})
    ids= ids.map((item)=>item.image._id)
    await cloudinary.api.delete_resources(ids)
    // drop collection 
    await recipesModel.collection.drop()
    res.json()
  } catch (error) {
    res.status(500).json()
  }
}

module.exports = {
  addRecipe,
  getRecipes,
  getSpecificRecipe,
  updateRecipe,
  upload,
  deleteRecipe,
  clearRecipes
};

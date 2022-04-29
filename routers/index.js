const router = require("express").Router();
const recipeControllers = require("../controllers/recipes");

router.post(
  "/recipe",
  recipeControllers.upload,
  recipeControllers.addRecipe,
);
router.get("/recipes", recipeControllers.getRecipes);
router.get("/recipe/:id", recipeControllers.getSpecificRecipe);

router.patch("/recipe/:id", 
recipeControllers.upload,
recipeControllers.updateRecipe);

router.delete("/recipe/:id", recipeControllers.deleteRecipe);
router.delete('/clearRecipes',recipeControllers.clearRecipes)

module.exports = router;

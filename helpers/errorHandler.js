function errorHandler(err, req, res, next) {
  switch (err.name) {
    case "recipeIsExist":
      res.status(400).json({ error: "Recipe is Exist" });
      break;
    case "recipeIsNotExist":
      res.status(400).json({ error: "Recipe is not Exist" });
      break;
    case "OnlyImages":
      res.status(400).json({ error: "Only images are allowed" });
      break;
  }
}
module.exports = errorHandler;

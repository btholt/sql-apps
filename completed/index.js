const ingredients = require("./ingredients/api");
const recipes = require("./recipes/api");

const { Router } = require("express");
const router = Router();

router.use("/recipes", recipes);
router.use("/ingredients", ingredients);

module.exports = router;

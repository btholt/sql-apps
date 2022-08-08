const express = require("express");

const recipes = require("./recipes/api");
const ingredients = require("./ingredients/api");

const app = express();

app.use(express.json());
app.use("/images", express.static("./images"));
app.use("/recipes", recipes);
app.use("/ingredients", ingredients);

app.get("/hello", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("listening on http://localhost:" + PORT);

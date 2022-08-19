const express = require("express");
const path = require("path");

const recipes = require("./recipes/api");
const ingredients = require("./ingredients/api");

const app = express();

app.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
app.get("/style.css", (_, res) =>
  res.sendFile(path.join(__dirname, "./style.css"))
);

app.use(express.json());
app.use("/images", express.static("./images"));
app.use("/recipes", recipes);
app.use("/ingredients", ingredients);

app.get("/hello", (req, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("listening on http://localhost:" + PORT);

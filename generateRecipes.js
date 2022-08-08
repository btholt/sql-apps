const path = require("path");
const fs = require("fs/promises");
const fsNotPromise = require("fs");
const imageDl = require("image-downloader");

function makeDescription(description, list) {
  let ans = description + "\\n";
  const ingredientList = [];

  for (let i = 0; i < list.length; i++) {
    if (list[i]) {
      ans += `\\n${i + 1}. Add ${list[i]}`;
      ingredientList.push(list[i]);
    }
  }

  return { description: ans, ingredientList };
}

const makeSafe = (s) => s.replaceAll("'", `''`).replaceAll('"', "");

async function ingredients() {
  const text = await fs.readFile(path.join(__dirname, "recipes.json"));
  const obj = JSON.parse(text);

  const seen = new Set();

  const recipeStream = fsNotPromise.createWriteStream(
    path.join(__dirname, "recipes.sql"),
    {
      flags: "w",
      encoding: "utf8",
      mode: 0o666,
      autoClose: true,
      emitClose: true,
      start: 0,
    }
  );

  const ingredientStream = fsNotPromise.createWriteStream(
    path.join(__dirname, "ingredient.sql"),
    {
      flags: "w",
      encoding: "utf8",
      mode: 0o666,
      autoClose: true,
      emitClose: true,
      start: 0,
    }
  );

  for (let i = 0; i < 50; i++) {
    let index = Math.floor(Math.random() * obj.length);

    while (
      seen.has(index) ||
      !obj[index].description ||
      obj[index].source === "tastykitchen" ||
      !obj[index].image
    ) {
      index = index = Math.floor(Math.random() * obj.length);
    }

    const recipe = obj[index];
    seen.add(index);

    const { description, ingredientList } = makeDescription(
      recipe.description,
      recipe.ingredients.split("\n")
    );

    try {
      await imageDl.image({
        dest: path.join(
          __dirname,
          "newImages",
          recipe.name.replaceAll(/\W/gi, "") + ".jpg"
        ),
        url: recipe.image,
      });
    } catch (e) {
      console.log("failed " + recipe.name + " image dl");
    }

    recipeStream.write(
      `('${makeSafe(recipe.name)}', '${makeSafe(description)}'),\n`
    );

    ingredientList.forEach((ingredient) => {
      ingredientStream.write(`('${makeSafe(ingredient)}', 'other', ''),\n`);
    });
  }
}

ingredients();

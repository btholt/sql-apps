const path = require("path");
const express = require("express");
const router = express.Router();

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);

/**
 * Student code starts here
 */

// connect to postgres

router.get("/type", async (req, res) => {
  const { type } = req.query;
  console.log("get ingredients", type);

  // return all ingredients of a type

  res.status(501).json({ status: "not implemented", rows: [] });
});

router.get("/search", async (req, res) => {
  let { term, page } = req.query;
  page = page ? page : 0;
  console.log("search ingredients", term, page);

  // return all columns as well as the count of all rows as total_count
  // make sure to account for pagination and only return 5 rows at a time

  res.status(501).json({ status: "not implemented", rows: [] });
});

/**
 * Student code ends here
 */

module.exports = router;

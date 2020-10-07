var express = require("express");
var router = express.Router();

const getPageController = require("../controllers/getPageController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/getTags", getPageController.getUserTags);

module.exports = router;

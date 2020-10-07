const express = require("express");
const router = express.Router();

const getPageController = require("../controllers/getPageController");

router.get("/", getPageController.getPage);
router.get("/tag/:tag", getPageController.getPageWithTag);
router.get("/loadMore/:tag", getPageController.loadMoreWithTag);

module.exports = router;

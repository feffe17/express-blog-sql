const express = require("express");
const router = express.Router();
const postsController = require("../controllers/dbControllers");

router.get('/id/:id', postsController.getPostById);

router.get("/", postsController.index);

router.get("/:title", postsController.show);

router.post("/", postsController.store);

router.put("/:title", postsController.update);

router.delete("/:title", postsController.destroy)

module.exports = router;
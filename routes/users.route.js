const { Router } = require("express");
const {
  getUsers,
  updateUser,
  createUser,
  updateUserPartial,
  deleteUser,
} = require("../controllers/user.controller");
const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id", updateUserPartial);
router.delete("/:id", deleteUser);

module.exports = router;

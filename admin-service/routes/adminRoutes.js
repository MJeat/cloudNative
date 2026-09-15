const express = require("express");

const {
    searchUser,
    viewAllUsers,
    deleteUser
} = require("../controllers/adminController");

const router = express.Router();

router.get("/searchuser", searchUser);
router.get("/viewalluser", viewAllUsers);
router.delete("/deluser", deleteUser);

module.exports = router;
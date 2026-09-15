const express = require("express");

const {
    viewProfile,
    updateProfile
} = require("../controllers/userController");

const router = express.Router();

const gatewayAuth = (req, res, next) => {
    const userId = req.headers["x-user-id"];
    const email = req.headers["x-user-email"];
    const role = req.headers["x-user-role"];

    if (!userId || !email || !role) {
        return res.status(401).json({
            message: "Authentication information missing"
        });
    }

    req.user = {
        userId,
        email,
        role
    };

    next();
};

router.get("/viewprofile", gatewayAuth, viewProfile);
router.put("/updateprofile", gatewayAuth, updateProfile);

module.exports = router;
const User = require("../models/User");

const viewProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile retrieved successfully",
            user
        });

    } catch (error) {
        console.error("View profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { name, phone } = req.body;

        if (!name && !phone) {
            return res.status(400).json({
                message: "Please provide name or phone to update"
            });
        }

        const updateData = {};

        if (name) {
            updateData.name = name.trim();
        }

        if (phone) {
            updateData.phone = phone.trim();
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    viewProfile,
    updateProfile
};
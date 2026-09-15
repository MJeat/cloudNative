const User = require("../models/User");

const searchUser = async (req, res) => {
    try {
        const { name, email } = req.query;

        const searchName = Array.isArray(name) ? name[0] : name;
        const searchEmail = Array.isArray(email) ? email[0] : email;

        if (!searchName && !searchEmail) {
            return res.status(400).json({
                message: "Please provide name or email"
            });
        }

        const searchConditions = [];

        if (searchName) {
            searchConditions.push({
                name: { $regex: searchName, $options: "i" }
            });
        }

        if (searchEmail) {
            searchConditions.push({
                email: { $regex: searchEmail, $options: "i" }
            });
        }

        const users = await User.find({
            $or: searchConditions
        }).select("-password");

        if (users.length === 0) {
            return res.status(404).json({
                message: "No user found"
            });
        }

        res.status(200).json({
            message: "User(s) found",
            users
        });

    } catch (error) {
        console.error("Search error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const viewAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            message: "All users retrieved successfully",
            users
        });

    } catch (error) {
        console.error("View all users error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteUser = async (req, res) => {
    try {
        const { email } = req.query;

        const searchEmail = Array.isArray(email) ? email[0] : email;

        if (!searchEmail) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const deletedUser = await User.findOneAndDelete({
            email: searchEmail.toLowerCase().trim()
        });

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully",
            user: {
                id: deletedUser._id,
                name: deletedUser.name,
                email: deletedUser.email,
                role: deletedUser.role
            }
        });

    } catch (error) {
        console.error("Delete user error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    searchUser,
    viewAllUsers,
    deleteUser
};
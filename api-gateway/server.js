require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const {
    authenticateToken,
    authorizeRole
} = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

/*
    Generic request forwarding function
*/
const forwardRequest = async (req, res, serviceUrl) => {
    try {
        const url = `${serviceUrl}${req.originalUrl}`;

        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            params: req.query,
            headers: {
                "x-user-id": req.user?.userId,
                "x-user-email": req.user?.email,
                "x-user-role": req.user?.role
            }
        });

        res.status(response.status).json(response.data);

    } catch (error) {

        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({
                message: "Microservice unavailable",
                error: error.message
            });
        }
    }
};


/*
    Registration Service
*/
app.use("/register", (req, res) => {
    forwardRequest(
        req,
        res,
        process.env.REGISTRATION_SERVICE_URL
    );
});


/*
    Login Service
*/
app.use("/auth", (req, res) => {
    forwardRequest(
        req,
        res,
        process.env.LOGIN_SERVICE_URL
    );
});

/*
Admin
*/
app.use(
    "/admin",
    authenticateToken,
    authorizeRole("admin"),
    (req, res) => {
        forwardRequest(
            req,
            res,
            process.env.ADMIN_SERVICE_URL
        );
    }
);

/*
User
*/
app.use(
    "/user",
    authenticateToken,
    authorizeRole("user"),
    (req, res) => {
        forwardRequest(
            req,
            res,
            process.env.USER_SERVICE_URL
        );
    }
);


/*
    Gateway health check
*/
app.get("/", (req, res) => {
    res.json({
        message: "API Gateway is running"
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
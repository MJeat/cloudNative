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

const serviceTargets = [
    {
        name: "Registration Service",
        route: "/register",
        envKey: "REGISTRATION_SERVICE_URL"
    },
    {
        name: "Login Service",
        route: "/auth",
        envKey: "LOGIN_SERVICE_URL"
    },
    {
        name: "Admin Service",
        route: "/admin",
        envKey: "ADMIN_SERVICE_URL"
    },
    {
        name: "User Service",
        route: "/user",
        envKey: "USER_SERVICE_URL"
    }
];

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
    Advanced gateway system status
*/
app.get("/system/status", (req, res) => {
    const services = serviceTargets.map((service) => ({
        name: service.name,
        route: service.route,
        configured: Boolean(process.env[service.envKey])
    }));

    const configuredServices = services.filter((service) => service.configured).length;

    res.json({
        service: "API Gateway",
        status: "running",
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.floor(process.uptime()),
        services,
        summary: {
            configuredServices,
            totalServices: services.length
        }
    });
});

app.get("/health", (req, res) => {
    res.json({
        message: "API Gateway is running"
    });
});

/*
    Gateway dashboard with quick action buttons
*/
app.get("/", (req, res) => {
    res.type("html").send(`<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cloud Native Identity Gateway</title>
    <style>
        :root {
            color-scheme: dark;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a, #1e293b);
            color: #e2e8f0;
            display: grid;
            place-items: center;
            padding: 24px;
        }
        .card {
            width: min(760px, 100%);
            background: rgba(15, 23, 42, 0.75);
            border: 1px solid rgba(148, 163, 184, 0.3);
            border-radius: 16px;
            padding: 28px;
            box-shadow: 0 20px 40px rgba(2, 6, 23, 0.45);
        }
        h1 {
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 1.6rem;
        }
        p {
            margin: 0 0 16px;
            color: #cbd5e1;
        }
        .actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px;
            margin-bottom: 18px;
        }
        .button {
            display: inline-block;
            text-align: center;
            text-decoration: none;
            font-weight: 700;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid #334155;
            color: #f8fafc;
            background: #1d4ed8;
            transition: transform 0.15s ease, background 0.15s ease;
        }
        .button:hover {
            transform: translateY(-1px);
            background: #2563eb;
        }
        .status {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
            white-space: pre-wrap;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid #334155;
            border-radius: 10px;
            padding: 12px;
            margin: 0;
            overflow: auto;
            max-height: 280px;
        }
    </style>
</head>
<body>
    <main class="card">
        <h1>Cloud Native Identity Gateway</h1>
        <p>Unique quick-access control panel for your microservices.</p>
        <div class="actions">
            <a class="button" href="/register">Registration</a>
            <a class="button" href="/auth">Login</a>
            <a class="button" href="/admin">Admin</a>
            <a class="button" href="/user">User</a>
            <a class="button" href="/system/status">Gateway Status</a>
        </div>
        <pre id="status" class="status">Loading system status...</pre>
    </main>
    <script>
        fetch("/system/status")
            .then((response) => response.json())
            .then((data) => {
                document.getElementById("status").textContent = JSON.stringify(data, null, 2);
            })
            .catch(() => {
                document.getElementById("status").textContent = "Could not load status details.";
            });
    </script>
</body>
</html>`);
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
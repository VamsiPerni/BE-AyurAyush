const dotenv = require("dotenv");
dotenv.config();

const { apiRouter } = require("./api/v1/routes");

if (process.env.NODE_ENV != "production") {
    const dns = require("dns");
    dns.setServers([process.env.DNS_SERVER, process.env.DNS_ALTERNATE_SERVER]);
}

require("./config/db.js");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL,
            process.env.FRONTEND_URL_VERCEL,
            process.env.FRONTEND_URL_CUSTOM_DOMAIN,
        ],
        credentials: true,
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    }),
);

app.use((req, res, next) => {
    setTimeout(() => {
        next();
    }, 2000);
});

// rate limiter

app.use(morgan("dev"));

app.use(express.json()); // body-parser in json format

app.use(cookieParser()); // body-parser in json format

app.get("/", (req, res) => {
    res.send("<h1>Server is running ...</h1>");
});

app.use("/api/v1", apiRouter);

app.listen(process.env.PORT, () => {
    console.log("-------- Server started --------");
});

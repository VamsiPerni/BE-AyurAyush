const express = require("express");
const {
    validateLoggedInUserMiddleware,
    validateDoctorRole,
} = require("../middlewares");
const { doctorDashboardController } = require("./controllers");

const doctorsRouter = express.Router();

doctorsRouter.get(
    "/dashboard",
    validateLoggedInUserMiddleware,
    validateDoctorRole,
    doctorDashboardController,
);

module.exports = {
    doctorsRouter,
};

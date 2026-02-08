const express = require("express");
const {
    validateLoggedInUserMiddleware,
    validateIsAdminMiddleware,
} = require("../middlewares");
const {
    adminDashboardController,
    reviewDoctorApplicationsController,
    approveDoctorApplicationController,
    rejectDoctorApplicationController,
} = require("./controllers");

const adminsRouter = express.Router();

adminsRouter.get(
    "/dashboard",
    validateLoggedInUserMiddleware,
    validateIsAdminMiddleware,
    adminDashboardController,
);

adminsRouter.get(
    "/doctor-applications",
    validateLoggedInUserMiddleware,
    validateIsAdminMiddleware,
    reviewDoctorApplicationsController,
);

adminsRouter.post(
    "/doctor-applications/:applicationId/approve",
    validateLoggedInUserMiddleware,
    validateIsAdminMiddleware,
    approveDoctorApplicationController,
);

adminsRouter.post(
    "/doctor-applications/:applicationId/reject",
    validateLoggedInUserMiddleware,
    validateIsAdminMiddleware,
    rejectDoctorApplicationController,
);

module.exports = {
    adminsRouter,
};

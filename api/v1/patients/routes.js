const express = require("express");
const {
    validateLoggedInUserMiddleware,
    validatePatientRole,
} = require("../middlewares");
const {
    patientDashboardController,
    applyForDoctorRoleController,
} = require("./controllers");

const patientsRouter = express.Router();

patientsRouter.get(
    "/dashboard",
    validateLoggedInUserMiddleware,
    validatePatientRole,
    patientDashboardController,
);

// Apply for doctor role
patientsRouter.post(
    "/apply-doctor-role",
    validateLoggedInUserMiddleware,
    validatePatientRole,
    applyForDoctorRoleController,
);

module.exports = { patientsRouter };
